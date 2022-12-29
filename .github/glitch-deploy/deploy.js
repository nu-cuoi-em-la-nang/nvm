const upload_Md = require('./git-push.js');
const createNew_Md = require('./newCreate.js')
const shell = require('shelljs')
const queryString = require('query-string');
const axios = require("axios").default;
const axiosRetry = require('axios-retry');

setTimeout(() => {
  console.log('force exit');
  process.exit(0)
}, 30 * 60 * 1000);

axiosRetry(axios, {
  retries: 100,
  retryDelay: (retryCount) => {
    // console.log(`retry attempt: ${retryCount}`);
    return 3000 || retryCount * 1000;
  },
  retryCondition: (error) => {
    return error.response.status === 502;
  },
});


const listProject = `https://e5070807-a2a7-41e6-9a9e-394ac59c3d3d@api.glitch.com/git/exuberant-erratic-cuckoo|https://e5070807-a2a7-41e6-9a9e-394ac59c3d3d@api.glitch.com/git/dark-bevel-marionberry|https://e5070807-a2a7-41e6-9a9e-394ac59c3d3d@api.glitch.com/git/peat-bustling-existence|https://e5070807-a2a7-41e6-9a9e-394ac59c3d3d@api.glitch.com/git/curved-fringe-seed|https://e5070807-a2a7-41e6-9a9e-394ac59c3d3d@api.glitch.com/git/fluorescent-short-equipment|https://e5070807-a2a7-41e6-9a9e-394ac59c3d3d@api.glitch.com/git/aquamarine-swamp-dingo|https://e5070807-a2a7-41e6-9a9e-394ac59c3d3d@api.glitch.com/git/cerulean-cypress-manatee|https://e5070807-a2a7-41e6-9a9e-394ac59c3d3d@api.glitch.com/git/honeysuckle-swift-duke|https://e5070807-a2a7-41e6-9a9e-394ac59c3d3d@api.glitch.com/git/morning-relieved-narcissus|https://e5070807-a2a7-41e6-9a9e-394ac59c3d3d@api.glitch.com/git/magic-zany-rock|https://e5070807-a2a7-41e6-9a9e-394ac59c3d3d@api.glitch.com/git/thoughtful-maze-politician|https://e5070807-a2a7-41e6-9a9e-394ac59c3d3d@api.glitch.com/git/discreet-heavy-soprano|https://e5070807-a2a7-41e6-9a9e-394ac59c3d3d@api.glitch.com/git/slender-holistic-dietician|https://e5070807-a2a7-41e6-9a9e-394ac59c3d3d@api.glitch.com/git/synonymous-saber-army`.trim().split('|');

const delay = t => {
  return new Promise(function(resolve) {
    setTimeout(function() {
      resolve(true);
    }, t);
  });
};

(async () => {
  try {
    let accountNumber = 0;

    for (let i = 0; i < listProject.length; i++) {
      accountNumber = i + 1;
      try {
        const nameProject = listProject[i].split('/')[4]
        console.log('deploy', nameProject);
        createNew_Md.run(nameProject)
        await upload_Md.upload2Git(listProject[i].trim(), 'code4Delpoy');
        console.log(`account ${accountNumber} upload success ^_^`);

        axios
          .get(`https://eager-profuse-python.glitch.me/deploy?${queryString.stringify({
            email: listProject[i].trim() + ' true'
          })}`)
          .then((response) => {
            console.log(response.data);
          })
          .catch((error) => {
            if (error.response) {
              console.log(error.response.data);
            } else {
              console.log('Loi');
            }
          });

        if (i + 1 < listProject.length) await delay(1.8 * 60 * 1000);
      } catch (error) {
        console.log(`account ${accountNumber} upload fail ^_^`);
        axios
          .get(`https://eager-profuse-python.glitch.me/deploy?${queryString.stringify({
            email: listProject[i].trim() + ' false'
          })}`)
          .then((response) => {
            console.log(response.data);
          })
          .catch((error) => {
            if (error.response) {
              console.log(error.response.data);
            } else {
              console.log('Loi');
            }
          });
      }

      if (process.cwd().includes('code4Delpoy')) shell.cd('../', { silent: true });

    }

    await delay(20000)
    console.log('Done! exit')
    process.exit(0)

  } catch (err) {
    console.log(`error: ${err}`);
  }
})();