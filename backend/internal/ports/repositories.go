package ports

import (
	"context"

	"github.com/NathanielChristian2077/codex-core-web-beta/backend/internal/domain"
)

type ProjectRepository interface {
	Create(ctx context.Context, project domain.Project) (domain.Project, error)
	FindByID(ctx context.Context, id domain.ID) (domain.Project, error)
	ListByUser(ctx context.Context, userID domain.ID) ([]domain.Project, error)
	Update(ctx context.Context, project domain.Project) (domain.Project, error)
	Delete(ctx context.Context, id domain.ID) error
}

type NodeTypeRepository interface {
	Create(ctx context.Context, nodeType domain.NodeType) (domain.NodeType, error)
	ListByProject(ctx context.Context, projectID domain.ID) ([]domain.NodeType, error)
	Update(ctx context.Context, nodeType domain.NodeType) (domain.NodeType, error)
	Delete(ctx context.Context, id domain.ID) error
}

type EdgeTypeRepository interface {
	Create(ctx context.Context, edgeType domain.EdgeType) (domain.EdgeType, error)
	ListByProject(ctx context.Context, projectID domain.ID) ([]domain.EdgeType, error)
	Update(ctx context.Context, edgeType domain.EdgeType) (domain.EdgeType, error)
	Delete(ctx context.Context, id domain.ID) error
}

type NodeRepository interface {
	Create(ctx context.Context, node domain.Node) (domain.Node, error)
	FindByID(ctx context.Context, id domain.ID) (domain.Node, error)
	ListByProject(ctx context.Context, projectID domain.ID) ([]domain.Node, error)
	Update(ctx context.Context, node domain.Node) (domain.Node, error)
	Delete(ctx context.Context, id domain.ID) error
}

type EdgeRepository interface {
	Create(ctx context.Context, edge domain.Edge) (domain.Edge, error)
	ListByProject(ctx context.Context, projectID domain.ID) ([]domain.Edge, error)
	Update(ctx context.Context, edge domain.Edge) (domain.Edge, error)
	Delete(ctx context.Context, id domain.ID) error
}
