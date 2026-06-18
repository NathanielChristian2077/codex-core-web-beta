package parsers

import (
	"reflect"
	"testing"
)

func TestExtractInternalLinksReturnsTypedLinksInOrder(t *testing.T) {
	content := "Bilbo meets <<CHARACTER:Gandalf>> at <<LOCATION:Bag End>> before <<EVENT:An Unexpected Party>>."

	links := ExtractInternalLinks(content)

	expected := []InternalLink{
		{Kind: "CHARACTER", Label: "Gandalf"},
		{Kind: "LOCATION", Label: "Bag End"},
		{Kind: "EVENT", Label: "An Unexpected Party"},
	}
	if !reflect.DeepEqual(links, expected) {
		t.Fatalf("unexpected links: %#v", links)
	}
}

func TestExtractInternalLinksIgnoresUnsupportedPatterns(t *testing.T) {
	content := "Ignore <<character:lowercase>>, <<BROKEN>>, <LOCATION:Rivendell>, and <<TOO>MANY>>."

	links := ExtractInternalLinks(content)

	if len(links) != 0 {
		t.Fatalf("expected unsupported patterns to be ignored, got %#v", links)
	}
}

func TestExtractInternalLinksAllowsLabelsWithColon(t *testing.T) {
	content := "Reference <<NOTE:Act I: Opening Scene>>."

	links := ExtractInternalLinks(content)

	expected := []InternalLink{{Kind: "NOTE", Label: "Act I: Opening Scene"}}
	if !reflect.DeepEqual(links, expected) {
		t.Fatalf("unexpected links: %#v", links)
	}
}
