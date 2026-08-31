#!/usr/bin/env node

import * as p from '@clack/prompts';

const ESC = '\x1b[';
const color = {
  reset: `${ESC}0m`,
  blue: `${ESC}38;2;45;125;255m`,
  cyan: `${ESC}38;2;51;205;211m`,
  white: `${ESC}97m`,
  gray: `${ESC}38;2;130;130;130m`,
  green: `${ESC}38;2;80;220;100m`
};

const archetypes = [
  { value: 'web-app', label: 'Web application', hint: 'Browser-based UI and services' },
  { value: 'desktop-app', label: 'Desktop application', hint: 'Native or cross-platform desktop software' },
  { value: 'embedded-system', label: 'Embedded system', hint: 'MCU, SBC or device-oriented software' },
  { value: 'hardware', label: 'Hardware', hint: 'Electronic or electromechanical design' },
  { value: 'data-analysis', label: 'Data analysis', hint: 'Exploration, models, reports or pipelines' },
  { value: 'integration-service', label: 'Integration service', hint: 'Bridges, APIs, synchronization or middleware' },
  { value: 'hybrid-product', label: 'Hybrid product', hint: 'Several coordinated hardware/software layers' }
];

const steps = ['Project Name', 'Purpose', 'Archetype', 'Starting Point', 'Assistance Areas'];

function paint(text, tone) {
  return `${color[tone]}${text}${color.reset}`;
}

function logo() {
  const e = [
    '         ',
    ' ██████╗ ',
    '██╔═══██╗',
    '████████║',
    '██╔═════╝',
    '╚██████╗ '
  ];

  const frame = [
    '███████╗██████╗  █████╗ ███╗   ███╗███████╗',
    '██╔════╝██╔══██╗██╔══██╗████╗ ████║██╔════╝',
    '█████╗  ██████╔╝███████║██╔████╔██║█████╗  ',
    '██╔══╝  ██╔══██╗██╔══██║██║╚██╔╝██║██╔══╝  ',
    '██║     ██║  ██║██║  ██║██║ ╚═╝ ██║███████╗',
    '╚═╝     ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝     ╚═╝╚══════╝'
  ];

  console.log('');
  for (let i = 0; i < e.length; i += 1) {
    console.log(`${paint(e[i], 'blue')}${paint(frame[i], 'white')}`);
  }
  console.log('');
  console.log(`  ${paint('ENGINEERING FRAMEWORK FOR PROJECT DEVELOPMENT', 'white')}`);
  console.log(paint('─'.repeat(Math.min(process.stdout.columns || 72, 86)), 'gray'));
  console.log(`  ${paint("Let's build something amazing. 🚀", 'cyan')}`);
  console.log('');
}

function progress(current) {
  const items = steps.map((label, index) => {
    const number = index + 1;
    if (number === current) return `${paint(`● ${number}`, 'blue')} ${paint(label, 'white')}`;
    if (number < current) return `${paint(`✓ ${number}`, 'green')} ${paint(label, 'gray')}`;
    return `${paint(`○ ${number}`, 'gray')} ${paint(label, 'gray')}`;
  });

  console.log(items.join(` ${paint('──', 'gray')} `));
  console.log('');
}

function cancelled(value) {
  if (p.isCancel(value)) {
    p.cancel('Project setup cancelled. No changes were made.');
    process.exit(0);
  }
  return value;
}

function buildPreview({ name, purpose, archetype, maturity, assistance }) {
  const files = ['README.md', 'AGENTS.md', 'docs/roadmap.md'];

  if (assistance.includes('architecture')) {
    files.push('docs/architecture/overview.md', 'docs/decisions/ADR-0001-project-archetype.md');
  }
  if (assistance.includes('toolchain')) files.push('docs/environment.md');
  if (assistance.includes('repository')) files.push('.gitignore', '.github/pull_request_template.md');
  if (assistance.includes('ci')) files.push('.github/workflows/ci.yml');

  return {
    specification: {
      project: { name, purpose, archetype, maturity },
      assistance
    },
    files,
    actions: [
      'Create project specification',
      'Render selected documentation and repository files',
      'Prepare archetype-specific next decisions',
      'Validate generated structure before any external action'
    ]
  };
}

console.clear();
logo();
p.note(
  `${paint('PREVIEW / DRY-RUN', 'blue')}\nNo files, commands, Git operations or remote changes will be applied.`,
  'Safe exploration mode'
);

progress(1);
const name = cancelled(await p.text({
  message: '1/5  What is the name of your project?',
  placeholder: 'orion',
  validate(value) {
    if (!value.trim()) return 'A project name is required.';
    if (!/^[a-zA-Z0-9._-]+$/.test(value.trim())) {
      return 'Use letters, numbers, dot, underscore or hyphen for now.';
    }
  }
}));

progress(2);
const purpose = cancelled(await p.text({
  message: '2/5  In one sentence, what are we building?',
  placeholder: 'An internal application for managing ...',
  validate(value) {
    if (value.trim().length < 12) return 'Give eFrame a little more context.';
  }
}));

progress(3);
const archetype = cancelled(await p.select({
  message: '3/5  What kind of project is this primarily?',
  options: archetypes,
  initialValue: 'web-app'
}));

progress(4);
const maturity = cancelled(await p.select({
  message: '4/5  What stage are we starting from?',
  options: [
    { value: 'greenfield', label: 'New project', hint: 'Start from an empty repository' },
    { value: 'existing', label: 'Existing project', hint: 'Adopt eFrame around current work' },
    { value: 'research', label: 'Exploration / research', hint: 'Decisions are still intentionally open' }
  ],
  initialValue: 'greenfield'
}));

progress(5);
const assistance = cancelled(await p.multiselect({
  message: '5/5  What should eFrame help prepare?',
  options: [
    { value: 'documentation', label: 'Project documentation' },
    { value: 'architecture', label: 'Architecture and ADRs' },
    { value: 'toolchain', label: 'Development environment / toolchain' },
    { value: 'repository', label: 'Repository structure and GitHub setup' },
    { value: 'ci', label: 'Validation and CI' }
  ],
  initialValues: ['documentation', 'architecture', 'toolchain', 'repository', 'ci'],
  required: true
}));

const archetypeLabel = archetypes.find((item) => item.value === archetype)?.label ?? archetype;
const preview = buildPreview({ name, purpose, archetype, maturity, assistance });

p.note(
  [
    `${paint('Project', 'blue')}: ${name}`,
    `${paint('Purpose', 'blue')}: ${purpose}`,
    `${paint('Archetype', 'blue')}: ${archetypeLabel}`,
    `${paint('Starting point', 'blue')}: ${maturity}`,
    `${paint('Assistance', 'blue')}: ${assistance.join(', ')}`
  ].join('\n'),
  'Discovery summary'
);

const inspect = cancelled(await p.confirm({
  message: 'Show what eFrame would prepare?',
  initialValue: true
}));

if (!inspect) {
  p.outro('Preview stopped. No changes were made.');
  process.exit(0);
}

p.note(preview.files.map((file) => `${paint('+', 'blue')} ${file}`).join('\n'), 'Planned files');
p.note(preview.actions.map((action, index) => `${paint(String(index + 1), 'blue')}. ${action}`).join('\n'), 'Planned actions');
p.note(JSON.stringify(preview.specification, null, 2), 'Project specification (preview)');

const proceed = cancelled(await p.confirm({
  message: 'Does this look like the right project plan?',
  initialValue: true
}));

if (!proceed) {
  p.outro('Refine the decisions and preview again. Nothing was generated.');
  process.exit(0);
}

p.outro(`${paint('Dry-run complete.', 'blue')} Next decision path would be: ${archetypeLabel}. No files or repositories were created.`);
