package websocket

import "sync"

type Client struct {
	outgoing  chan ServerEvent
	done      chan struct{}
	closeOnce sync.Once
}

func NewClient(bufferSize int) *Client {
	return &Client{
		outgoing: make(chan ServerEvent, bufferSize),
		done:     make(chan struct{}),
	}
}

func (c *Client) Send(event ServerEvent) {
	select {
	case <-c.done:
		return
	default:
	}

	select {
	case c.outgoing <- event:
	case <-c.done:
	default:
	}
}

func (c *Client) Outgoing() <-chan ServerEvent {
	return c.outgoing
}

func (c *Client) Done() <-chan struct{} {
	return c.done
}

func (c *Client) Close() {
	c.closeOnce.Do(func() {
		close(c.done)
	})
}
