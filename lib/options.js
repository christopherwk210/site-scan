let options = {
  path: '',
  height: 1920,
  width: 1080,
  full: false,
  transparent: false,
  jpeg: false,
  jpegQuality: 100,
  definitions: []
};

// Argument definitions
options.definitions = [
  {
    fields: [
      '-h',
      '--help'
    ],
    description: 'Display help'
  },
  {
    fields: [
      '-p',
      '--path'
    ],
    description: 'Path to save screenshots to',
    action: val => {
      options.path = val;
    }
  },
  {
    fields: [
      '-x',
      '--width'
    ],
    description: 'Custom viewport width',
    action: val => {
      options.width = val;
    }
  },
  {
    fields: [
      '-y',
      '--height'
    ],
    description: 'Custom viewport height',
    action: val => {
      options.height = val;
    }
  },
  {
    fields: [
      '-f',
      '--full'
    ],
    description: 'Capture full page screenshot',
    action: val => {
      options.full = val;
    }
  },
  {
    fields: [
      '-t',
      '--transparent'
    ],
    description: 'Hides default background to allow transparency',
    action: val => {
      options.transparent = val;
    }
  },
  {
    fields: [
      '-j',
      '--jpeg'
    ],
    description: 'Capture JPEG screenshot',
    action: val => {
      options.jpeg = val;
    }
  },
  {
    fields: [
      '-q',
      '--quality'
    ],
    description: 'Quality of JPEG screenshot (0-100)',
    action: val => {
      options.jpegQuality = val;
    }
  }
];

module.exports = options;
