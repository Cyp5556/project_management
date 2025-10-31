export const MOCK_USERS = [
  { id: 'user1', name: 'John Doe', email: 'john@example.com', role: 'Owner', color: '#3b82f6' },
  { id: 'user2', name: 'Jane Smith', email: 'jane@example.com', role: 'Admin', color: '#ef4444' },
  { id: 'user3', name: 'Bob Johnson', email: 'bob@example.com', role: 'Editor', color: '#10b981' },
  { id: 'user4', name: 'Alice Williams', email: 'alice@example.com', role: 'Viewer', color: '#f59e0b' }
];

export const INITIAL_PROJECTS = [
  { 
    id: 'proj1', 
    name: 'Marketing Campaign', 
    members: ['user1', 'user2', 'user3'],
    pages: [
      { id: 'page1', title: 'Project Overview', content: 'Welcome to the Marketing Campaign project!\n\n## Goals\n- Increase brand awareness\n- Generate leads\n\n## Timeline\nQ1 2025', parentId: null, children: ['page2'] },
      { id: 'page2', title: 'Q1 Goals', content: '# Q1 Marketing Goals\n\n## Objectives\n- [ ] Launch new website\n- [ ] Social media campaign\n- [x] Market research\n\nOur goals for Q1 include expanding our reach and improving conversion rates.', parentId: 'page1', children: [] }
    ],
    boards: [
      { 
        id: 'board1', 
        name: 'Marketing Tasks',
        columns: [
          { id: 'col1', name: 'To Do', cards: [
            { id: 'card1', title: 'Design landing page', description: 'Create mockups for the new landing page with modern design', labels: ['Design', 'High Priority'], assignee: 'user2', dueDate: '2025-11-15', linkedPage: 'page1' }
          ]},
          { id: 'col2', name: 'In Progress', cards: [
            { id: 'card2', title: 'Write blog post', description: 'Draft content about product features and benefits', labels: ['Content'], assignee: 'user3', dueDate: '2025-11-10', linkedPage: null }
          ]},
          { id: 'col3', name: 'Done', cards: [
            { id: 'card3', title: 'Market research', description: 'Completed competitor analysis and market positioning', labels: ['Research'], assignee: 'user1', dueDate: '2025-11-05', linkedPage: 'page2' }
          ]}
        ]
      }
    ]
  },
  { 
    id: 'proj2', 
    name: 'Product Development', 
    members: ['user1', 'user3', 'user4'],
    pages: [
      { id: 'page3', title: 'Architecture', content: '# System Architecture\n\n## Overview\nMicroservices-based architecture\n\n## Components\n- API Gateway\n- Authentication Service\n- Database Cluster', parentId: null, children: [] }
    ],
    boards: [
      { 
        id: 'board2', 
        name: 'Sprint Board',
        columns: [
          { id: 'col4', name: 'Backlog', cards: [] },
          { id: 'col5', name: 'In Development', cards: [] },
          { id: 'col6', name: 'Testing', cards: [] },
          { id: 'col7', name: 'Deployed', cards: [] }
        ]
      }
    ]
  }
];