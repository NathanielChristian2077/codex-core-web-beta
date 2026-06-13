package domain

type FieldType string

const (
	FieldTypeText        FieldType = "text"
	FieldTypeLongText    FieldType = "long_text"
	FieldTypeNumber      FieldType = "number"
	FieldTypeBoolean     FieldType = "boolean"
	FieldTypeDate        FieldType = "date"
	FieldTypeSelect      FieldType = "select"
	FieldTypeMultiSelect FieldType = "multi_select"
	FieldTypeURL         FieldType = "url"
	FieldTypeNodeRef     FieldType = "node_ref"
)

type FieldOption struct {
	Label string `json:"label"`
	Value string `json:"value"`
}

type FieldDefinition struct {
	Key         string        `json:"key"`
	Label       string        `json:"label"`
	Type        FieldType     `json:"type"`
	Required    bool          `json:"required"`
	Description *string       `json:"description,omitempty"`
	Options     []FieldOption `json:"options,omitempty"`
	Default     any           `json:"default,omitempty"`
}
