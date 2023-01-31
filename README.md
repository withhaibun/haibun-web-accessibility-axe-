[![Haibun Axe unit tests](https://github.com/withhaibun/haibun-web-accessibility-axe/actions/workflows/test.yml/badge.svg)](https://github.com/withhaibun/haibun-web-accessibility-axe/actions/workflows/test.yml)

# haibun-web-accessibility-axe

Haibun Web Accessibility Axe is a module that incorporates Haibun's integration and testing with that of Axe, an accessibility test engine. 

## Installation

Normally, libraries from this repository will be included in a project like any other, or used via the cli, for example, using `npx @haibun/cli`. For more information you can visit `Haibun` at `https://github.com/withhaibun/haibun`

### Axe 

Axe serves as an accessibility testing ruleset developed by Deque Systems, and follows the interational standards set under WCAG. 

### Playwright-Axe 

Playwright-Axe is a Node library to combine the efforts of playwright and axe to conduct accessibility tests. 

To download playwright: 

`npm i-D @playwright/test`

To download playwright-axe: 

`npm i-D axe-playwright`

After the installation, the modules in this repository can be used freely. 

# Developing haibun-web-accessibility-axe

Installation uses a shell script, which is tested in Linux & macOS,
and should also work on Windows using WSL.

Clone the repo, 
and install Lerna and Typescript globally;

`npm i -g lerna typescript`

To run and test:

  `npx playwright test`


## Developing modules and Haibun core together

To develop your own separate module while developing Haibun modules, use:

`npm link @haibun/core`

and any other modules you may need.
 