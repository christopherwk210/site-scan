let options = {
  path: '',
  height: 1080,
  width: 1920,
  full: false,
  transparent: false,
  jpeg: false,
  jpegQuality: 100,
  sleep: 0,
  scale: 1,
  name: '',
  list: undefined,
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
      options.path = typeof val === 'string' ? val : '';
    }
  },
  {
    fields: [
      '-x',
      '--width'
    ],
    description: 'Custom viewport width',
    action: val => {
      options.width = typeof val === 'number' ? val : 1920;
    }
  },
  {
    fields: [
      '-y',
      '--height'
    ],
    description: 'Custom viewport height',
    action: val => {
      options.height = typeof val === 'number' ? val : 1080;
    }
  },
  {
    fields: [
      '-f',
      '--full'
    ],
    description: 'Capture full page screenshot',
    action: val => {
      options.full = typeof val === 'boolean' ? val : false;
    }
  },
  {
    fields: [
      '-t',
      '--transparent'
    ],
    description: 'Hides default background to allow transparency',
    action: val => {
      options.transparent = typeof val === 'boolean' ? val : false;
    }
  },
  {
    fields: [
      '-j',
      '--jpeg'
    ],
    description: 'Capture JPEG screenshot',
    action: val => {
      options.jpeg = typeof val === 'boolean' ? val : false;
    }
  },
  {
    fields: [
      '-q',
      '--quality'
    ],
    description: 'Quality of JPEG screenshot (0-100)',
    action: val => {
      options.jpegQuality = typeof val === 'number' ? val : 100;
    }
  },
  {
    fields: [
      '-s',
      '--sleep'
    ],
    description: 'Time (ms) to wait after load before screenshot',
    action: val => {
      options.sleep = typeof val === 'number' ? val : 0;
    }
  },
  {
    fields: [
      '-n',
      '--name'
    ],
    description: 'Custom file name (Multiple screenshots will append a number to this name)',
    action: val => {
      options.name = typeof val === 'string' ? val : '';
    }
  },
  {
    fields: [
      '-r',
      '--scale'
    ],
    description: 'Browser scaling',
    action: val => {
      options.scale = typeof val === 'number' ? val : 1;
    }
  },
  {
    fields: [
      '-l',
      '--list'
    ],
    description: 'Loads url(s) from a local file instead of the CLI (must be separated by a space character)',
    action: val => {
      options.list = typeof val === 'string' ? val : undefined;
    }
  }
];

module.exports = options;
