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


const listProject = `https://d8c88bdd-7750-4105-9713-329fa6bfc35a@api.glitch.com/git/innate-laced-sunfish|https://d8c88bdd-7750-4105-9713-329fa6bfc35a@api.glitch.com/git/darkened-accurate-skunk|https://d8c88bdd-7750-4105-9713-329fa6bfc35a@api.glitch.com/git/confusion-sparkling-coin|https://d8c88bdd-7750-4105-9713-329fa6bfc35a@api.glitch.com/git/fringe-plausible-error|https://d8c88bdd-7750-4105-9713-329fa6bfc35a@api.glitch.com/git/elderly-periodic-chicken|https://d8c88bdd-7750-4105-9713-329fa6bfc35a@api.glitch.com/git/chisel-enchanting-armchair|https://d8c88bdd-7750-4105-9713-329fa6bfc35a@api.glitch.com/git/oxidized-crimson-organization|https://d8c88bdd-7750-4105-9713-329fa6bfc35a@api.glitch.com/git/roasted-knowledgeable-plant|https://d8c88bdd-7750-4105-9713-329fa6bfc35a@api.glitch.com/git/concrete-garrulous-lunge|https://d8c88bdd-7750-4105-9713-329fa6bfc35a@api.glitch.com/git/confusion-seasoned-apple|https://d8c88bdd-7750-4105-9713-329fa6bfc35a@api.glitch.com/git/quilt-hallowed-duckling|https://d8c88bdd-7750-4105-9713-329fa6bfc35a@api.glitch.com/git/inky-bouncy-neon|https://d8c88bdd-7750-4105-9713-329fa6bfc35a@api.glitch.com/git/encouraging-flat-pair|https://d8c88bdd-7750-4105-9713-329fa6bfc35a@api.glitch.com/git/phantom-imaginary-rake`.trim().split('|');

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