package parsers

import "regexp"

type InternalLink struct {
	Kind  string `json:"kind"`
	Label string `json:"label"`
}

var internalLinkPattern = regexp.MustCompile(`<<([A-Z]+):([^>]+)>>`)

func ExtractInternalLinks(content string) []InternalLink {
	matches := internalLinkPattern.FindAllStringSubmatch(content, -1)
	links := make([]InternalLink, 0, len(matches))

	for _, match := range matches {
		if len(match) != 3 {
			continue
		}

		links = append(links, InternalLink{
			Kind:  match[1],
			Label: match[2],
		})
	}

	return links
}
