package websocket

type Client struct {
	outgoing chan ServerEvent
}

func NewClient(bufferSize int) *Client {
	return &Client{outgoing: make(chan ServerEvent, bufferSize)}
}

func (c *Client) Send(event ServerEvent) {
	select {
	case c.outgoing <- event:
	default:
	}
}

func (c *Client) Outgoing() <-chan ServerEvent {
	return c.outgoing
}
