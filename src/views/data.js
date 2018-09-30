var ganttData = [{
    id: 1,
    name: "Feature 1",
    series: [{
        id: (~~(Math.random() *
          (1 << 24))).toString(16),
        name: "Planned",
        start: moment().add(1, 'h'),
        end: moment().add(12, 'h')
      },
      {
        id: (~~(Math.random() *
          (1 << 24))).toString(16),
        name: "Actual",
        start: moment().add(3, 'h'),
        end: moment().add(14, 'h'),
        color: "#f0f0f0"
      }
    ]
  },
  {
    id: 2,
    name: "Feature 2",
    series: [{
        id: (~~(Math.random() *
          (1 << 24))).toString(16),
        name: "Planned",
        start: moment().add(5, 'h'),
        end: moment().add(16, 'h')
      },
      {
        id: (~~(Math.random() *
          (1 << 24))).toString(16),
        name: "Actual",
        start: moment().add(7, 'h'),
        end: moment().add(19, 'h'),
        color: "#f0f0f0"
      },
      {
        id: (~~(Math.random() *
          (1 << 24))).toString(16),
        name: "Projected",
        start: moment().add(10, 'h'),
        end: moment().add(33, 'h'),
        color: "#e0e0e0"
      }
    ]
  },
  {
    id: 3,
    name: "Feature 3",
    series: [{
        id: (~~(Math.random() *
          (1 << 24))).toString(16),
        name: "Planned",
        start: moment().add(12, 'h'),
        end: moment().add(25, 'h')
      },
      {
        id: (~~(Math.random() *
          (1 << 24))).toString(16),
        name: "Actual",
        start: moment().add(17, 'h'),
        end: moment().add(29, 'h'),
        color: "#f0f0f0"
      }
    ]
  },
  {
    id: 4,
    name: "Feature 4",
    series: [{
        id: (~~(Math.random() *
          (1 << 24))).toString(16),
        name: "Planned",
        start: moment().add(22, 'h'),
        end: moment().add(31, 'h')
      },
      {
        id: (~~(Math.random() *
          (1 << 24))).toString(16),
        name: "Actual",
        start: moment().add(12, 'h'),
        end: moment().add(25, 'h'),
        color: "#f0f0f0"
      }
    ]
  },
  {
    id: 5,
    name: "Feature 5",
    series: [{
        id: (~~(Math.random() *
          (1 << 24))).toString(16),
        name: "Planned",
        start: moment().add(1, 'h'),
        end: moment().add(13, 'h')
      },
      {
        id: (~~(Math.random() *
          (1 << 24))).toString(16),
        name: "Actual",
        start: moment().add(1, 'h'),
        end: moment().add(12, 'h'),
        color: "#f0f0f0"
      }
    ]
  },
  {
    id: 6,
    name: "Feature 6",
    series: [{
        id: (~~(Math.random() *
          (1 << 24))).toString(16),
        name: "Planned",
        start: moment().add(5, 'h'),
        end: moment().add(10, 'h')
      },
      {
        id: (~~(Math.random() *
          (1 << 24))).toString(16),
        name: "Actual",
        start: moment().add(8, 'h'),
        end: moment().add(18, 'h'),
        color: "#f0f0f0"
      },
      {
        id: (~~(Math.random() *
          (1 << 24))).toString(16),
        name: "Projected",
        start: moment().add(9, 'h'),
        end: moment().add(13, 'h'),
        color: "#e0e0e0"
      }
    ]
  },
  {
    id: 7,
    name: "Feature 7",
    series: [{
      id: (~~(Math.random() *
        (1 << 24))).toString(16),
      name: "Planned",
      start: moment().add(5, 'h'),
      end: moment().add(16, 'h')
    }]
  },
  {
    id: 8,
    name: "Feature 8",
    series: [{
        id: (~~(Math.random() *
          (1 << 24))).toString(16),
        name: "Planned",
        start: moment().add(8, 'h'),
        end: moment().add(19, 'h')
      },
      {
        id: (~~(Math.random() *
          (1 << 24))).toString(16),
        name: "Actual",
        start: moment().add(1, 'h'),
        end: moment().add(17, 'h'),
        color: "#f0f0f0"
      }
    ]
  }, {
    id: 1,
    name: "Feature 1",
    series: [{
        id: (~~(Math.random() *
          (1 << 24))).toString(16),
        name: "Planned",
        start: moment().add(1, 'h'),
        end: moment().add(12, 'h')
      },
      {
        id: (~~(Math.random() *
          (1 << 24))).toString(16),
        name: "Actual",
        start: moment().add(3, 'h'),
        end: moment().add(14, 'h'),
        color: "#f0f0f0"
      }
    ]
  },
  {
    id: 2,
    name: "Feature 2",
    series: [{
        id: (~~(Math.random() *
          (1 << 24))).toString(16),
        name: "Planned",
        start: moment().add(5, 'h'),
        end: moment().add(16, 'h')
      },
      {
        id: (~~(Math.random() *
          (1 << 24))).toString(16),
        name: "Actual",
        start: moment().add(7, 'h'),
        end: moment().add(19, 'h'),
        color: "#f0f0f0"
      },
      {
        id: (~~(Math.random() *
          (1 << 24))).toString(16),
        name: "Projected",
        start: moment().add(10, 'h'),
        end: moment().add(33, 'h'),
        color: "#e0e0e0"
      }
    ]
  },
  {
    id: 3,
    name: "Feature 3",
    series: [{
        id: (~~(Math.random() *
          (1 << 24))).toString(16),
        name: "Planned",
        start: moment().add(12, 'h'),
        end: moment().add(25, 'h')
      },
      {
        id: (~~(Math.random() *
          (1 << 24))).toString(16),
        name: "Actual",
        start: moment().add(17, 'h'),
        end: moment().add(29, 'h'),
        color: "#f0f0f0"
      }
    ]
  },
  {
    id: 4,
    name: "Feature 4",
    series: [{
        id: (~~(Math.random() *
          (1 << 24))).toString(16),
        name: "Planned",
        start: moment().add(22, 'h'),
        end: moment().add(31, 'h')
      },
      {
        id: (~~(Math.random() *
          (1 << 24))).toString(16),
        name: "Actual",
        start: moment().add(12, 'h'),
        end: moment().add(25, 'h'),
        color: "#f0f0f0"
      }
    ]
  },
  {
    id: 5,
    name: "Feature 5",
    series: [{
        id: (~~(Math.random() *
          (1 << 24))).toString(16),
        name: "Planned",
        start: moment().add(1, 'h'),
        end: moment().add(13, 'h')
      },
      {
        id: (~~(Math.random() *
          (1 << 24))).toString(16),
        name: "Actual",
        start: moment().add(1, 'h'),
        end: moment().add(12, 'h'),
        color: "#f0f0f0"
      }
    ]
  },
  {
    id: 6,
    name: "Feature 6",
    series: [{
        id: (~~(Math.random() *
          (1 << 24))).toString(16),
        name: "Planned",
        start: moment().add(5, 'h'),
        end: moment().add(10, 'h')
      },
      {
        id: (~~(Math.random() *
          (1 << 24))).toString(16),
        name: "Actual",
        start: moment().add(8, 'h'),
        end: moment().add(18, 'h'),
        color: "#f0f0f0"
      },
      {
        id: (~~(Math.random() *
          (1 << 24))).toString(16),
        name: "Projected",
        start: moment().add(9, 'h'),
        end: moment().add(13, 'h'),
        color: "#e0e0e0"
      }
    ]
  },
  {
    id: 7,
    name: "Feature 7",
    series: [{
      id: (~~(Math.random() *
        (1 << 24))).toString(16),
      name: "Planned",
      start: moment().add(5, 'h'),
      end: moment().add(16, 'h')
    }]
  },
  {
    id: 8,
    name: "Feature 8",
    series: [{
        id: (~~(Math.random() *
          (1 << 24))).toString(16),
        name: "Planned",
        start: moment().add(8, 'h'),
        end: moment().add(19, 'h')
      },
      {
        id: (~~(Math.random() *
          (1 << 24))).toString(16),
        name: "Actual",
        start: moment().add(1, 'h'),
        end: moment().add(17, 'h'),
        color: "#f0f0f0"
      }
    ]
  }
];