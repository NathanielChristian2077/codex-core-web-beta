package domain

import "testing"

func TestFieldTypeConstantsMatchPublicSchemaValues(t *testing.T) {
	cases := map[FieldType]string{
		FieldTypeText:        "text",
		FieldTypeLongText:    "long_text",
		FieldTypeNumber:      "number",
		FieldTypeBoolean:     "boolean",
		FieldTypeDate:        "date",
		FieldTypeSelect:      "select",
		FieldTypeMultiSelect: "multi_select",
		FieldTypeURL:         "url",
		FieldTypeNodeRef:     "node_ref",
	}

	for fieldType, expected := range cases {
		if string(fieldType) != expected {
			t.Fatalf("expected %q, got %q", expected, fieldType)
		}
	}
}

func TestFieldDefinitionStoresOptionsAndDefaults(t *testing.T) {
	description := "Used by presets and custom node types."
	field := FieldDefinition{
		Key:         "status",
		Label:       "Status",
		Type:        FieldTypeSelect,
		Required:    true,
		Description: &description,
		Options: []FieldOption{
			{Label: "Draft", Value: "draft"},
			{Label: "Published", Value: "published"},
		},
		Default: "draft",
	}

	if field.Key != "status" || field.Label != "Status" || field.Type != FieldTypeSelect {
		t.Fatalf("unexpected field definition identity: %#v", field)
	}
	if !field.Required || field.Description == nil || *field.Description != description {
		t.Fatalf("unexpected field definition metadata: %#v", field)
	}
	if len(field.Options) != 2 || field.Options[1].Value != "published" {
		t.Fatalf("unexpected field options: %#v", field.Options)
	}
	if field.Default != "draft" {
		t.Fatalf("unexpected default value: %#v", field.Default)
	}
}
