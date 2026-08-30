import * as p from '@clack/prompts';

const archetypes = [
  { value: 'web-app', label: 'Web application', hint: 'Browser-based UI and services' },
  { value: 'desktop-app', label: 'Desktop application', hint: 'Native or cross-platform desktop software' },
  { value: 'embedded-system', label: 'Embedded system', hint: 'MCU, SBC or device-oriented software' },
  { value: 'hardware', label: 'Hardware', hint: 'Electronic or electromechanical design' },
  { value: 'data-analysis', label: 'Data analysis', hint: 'Exploration, models, reports or pipelines' },
  { value: 'integration-service', label: 'Integration service', hint: 'Bridges, APIs, synchronization or middleware' },
  { value: 'hybrid-product', label: 'Hybrid product', hint: 'Several coordinated hardware/software layers' }
];

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

  if (assistance.includes('toolchain')) {
    files.push('docs/environment.md');
  }

  if (assistance.includes('repository')) {
    files.push('.gitignore', '.github/pull_request_template.md');
  }

  if (assistance.includes('ci')) {
    files.push('.github/workflows/ci.yml');
  }

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

const logo = String.raw`
   ___ _____
  / _// __/______ ___ _  ___
 / _// _// __/ _ \/  ' \/ -_)
/___/_/ /_/  \___/_/_/_/\__/
        engineering framework
`;

console.clear();
console.log(logo);
p.intro('eFrame · project discovery lab');

p.note(
  'Experimental mode. eFrame will build and display a project plan, but it will not create files, initialize Git or access GitHub.',
  'PREVIEW / DRY-RUN'
);

const name = cancelled(await p.text({
  message: 'What should we call the project?',
  placeholder: 'orion',
  validate(value) {
    if (!value.trim()) return 'A project name is required.';
    if (!/^[a-zA-Z0-9._-]+$/.test(value.trim())) {
      return 'Use letters, numbers, dot, underscore or hyphen for now.';
    }
  }
}));

const purpose = cancelled(await p.text({
  message: 'In one sentence, what are we building?',
  placeholder: 'An internal application for managing ...',
  validate(value) {
    if (value.trim().length < 12) return 'Give eFrame a little more context.';
  }
}));

const archetype = cancelled(await p.select({
  message: 'What kind of project is this primarily?',
  options: archetypes,
  initialValue: 'web-app'
}));

const maturity = cancelled(await p.select({
  message: 'What stage are we starting from?',
  options: [
    { value: 'greenfield', label: 'New project', hint: 'Start from an empty repository' },
    { value: 'existing', label: 'Existing project', hint: 'Adopt eFrame around current work' },
    { value: 'research', label: 'Exploration / research', hint: 'Decisions are still intentionally open' }
  ],
  initialValue: 'greenfield'
}));

const assistance = cancelled(await p.multiselect({
  message: 'What should eFrame help prepare?',
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
    `Project: ${name}`,
    `Purpose: ${purpose}`,
    `Archetype: ${archetypeLabel}`,
    `Starting point: ${maturity}`,
    `Assistance: ${assistance.join(', ')}`
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

p.note(
  preview.files.map((file) => `  + ${file}`).join('\n'),
  'Planned files'
);

p.note(
  preview.actions.map((action, index) => `  ${index + 1}. ${action}`).join('\n'),
  'Planned actions'
);

p.note(
  JSON.stringify(preview.specification, null, 2),
  'Project specification (preview)'
);

const proceed = cancelled(await p.confirm({
  message: 'Does this look like the right project plan?',
  initialValue: true
}));

if (!proceed) {
  p.outro('Good. Refine the decisions and preview again. Nothing was generated.');
  process.exit(0);
}

p.outro(`Dry-run complete. Next decision path would be: ${archetypeLabel}. No files or repositories were created.`);
