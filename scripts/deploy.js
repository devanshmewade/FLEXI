import { execSync } from 'node:child_process';
import { rmSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const distPath = resolve(process.cwd(), 'dist');

console.log('🚀 Building production distribution...');
execSync('npx vite build', { stdio: 'inherit' });

console.log('📦 Pushing to gh-pages branch...');
execSync('git -C dist init', { stdio: 'inherit' });
execSync('git -C dist checkout -B gh-pages', { stdio: 'inherit' });
execSync('git -C dist add -A', { stdio: 'inherit' });
execSync('git -C dist commit -m "Deploy CivicPulse AI to GitHub Pages"', { stdio: 'inherit' });
execSync('git -C dist remote add origin https://github.com/devanshmewade/FLEXI.git', { stdio: 'inherit' });
execSync('git -C dist push origin gh-pages --force', { stdio: 'inherit' });

if (existsSync(resolve(distPath, '.git'))) {
  rmSync(resolve(distPath, '.git'), { recursive: true, force: true });
}

console.log('✨ Deployed successfully to https://devanshmewade.github.io/FLEXI/');
