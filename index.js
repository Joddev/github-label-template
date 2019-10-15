import GitHub from 'github-api';
import fs from 'fs';

async function main() {
  const config = JSON.parse(fs.readFileSync('config.json'));

  const gh = new GitHub({
    token: config.token
  });

  try {
    for (const repo of config.repos) {
      const issue = gh.getIssues(...repo.split('/'));
      const labelSet = new Set((await issue.listLabels()).data.map(label => label.name));
    
      for (const label of config.labels) {
        if (labelSet.has(label.name)) {
          await issue.editLabel(label.name, label);
          console.log(`edited label '${label.name}'`);
        } else {
          await issue.createLabel(label);
          labelSet.add(label.name);
          console.log(`added label '${label.name}'`);
        } 
      }
    }
  } catch(err) {
    console.log(err);
  }
}

main();
