#!/usr/bin/env node

import { Command } from 'commander';

const program = new Command();

async function runAssistant() {
  await import('./index.js');
}

function notImplemented(command, description) {
  console.log(`eFrame ${command}`);
  console.log(description);
  console.log('');
  console.log('This command is registered but not implemented yet.');
}

program
  .name('eframe')
  .description('Engineering Framework for Project Development')
  .version('0.0.0');

program
  .command('new')
  .description('Start interactive project discovery and planning')
  .option('--dry-run', 'Never apply changes (currently always enabled)')
  .action(async () => {
    await runAssistant();
  });

program
  .command('init')
  .description('Adopt eFrame in an existing project')
  .action(() => notImplemented('init', 'Initialize eFrame metadata and project guidance in an existing repository.'));

program
  .command('doctor')
  .description('Inspect eFrame, host and project environment health')
  .option('--project', 'Focus on current project requirements')
  .action(() => notImplemented('doctor', 'Inspect runtime, host capabilities and project environment requirements.'));

program
  .command('plan')
  .description('Resolve an inspectable project plan without applying changes')
  .option('-o, --output <file>', 'Write the plan representation to a file')
  .action(() => notImplemented('plan', 'Build the side-effect-free plan from the project specification.'));

program
  .command('inspect')
  .description('Inspect planned files, scripts, commands and remote operations')
  .action(() => notImplemented('inspect', 'Open the current plan for interactive inspection.'));

program
  .command('diff')
  .description('Compare the current workspace with the resolved plan')
  .action(() => notImplemented('diff', 'Show the differences between current project state and planned state.'));

program
  .command('apply')
  .description('Explicitly apply an inspected plan')
  .option('--files', 'Apply file changes only')
  .option('--commands', 'Apply executable commands only')
  .option('--remote', 'Apply remote/provider operations only')
  .action(() => notImplemented('apply', 'Apply an already resolved and inspected plan.'));

program
  .command('validate')
  .description('Validate project structure, environment and generated state')
  .action(() => notImplemented('validate', 'Run project validation using declared requirements and capabilities.'));

program
  .command('explain')
  .description('Explain resolved decisions and why eFrame recommends them')
  .action(() => notImplemented('explain', 'Explain project decisions, defaults and planned actions.'));

program
  .command('publish')
  .description('Plan or perform authorized publication/distribution flows')
  .action(() => notImplemented('publish', 'Resolve publication, projection or artifact-distribution operations.'));

if (process.argv.length <= 2) {
  await runAssistant();
} else {
  await program.parseAsync(process.argv);
}
