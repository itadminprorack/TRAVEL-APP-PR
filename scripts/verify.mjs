import { spawnSync } from 'node:child_process';
import {readdirSync,statSync} from 'node:fs';
const files=readdirSync('src').filter(f=>f.endsWith('.js'));
let errors=0;
for(const name of files){const p=spawnSync(process.execPath,['--check',`src/${name}`],{encoding:'utf8'});if(p.status!==0){errors++;console.error(`${name}: ${p.stderr}`);}}
const testFiles=readdirSync('tests').filter(f=>f.endsWith('.test.js')).map(f=>`tests/${f}`);
const test=spawnSync(process.execPath,['--test',...testFiles],{stdio:'inherit'});
if(test.status!==0)errors++;
if(!statSync('index.html').isFile()||!statSync('src/styles.css').isFile())errors++;
if(errors)process.exit(1);
console.log(`Verified ${files.length} JavaScript modules and all unit tests. Local MVP ready.`);
