# SPIN DX

## Environments
- Preview: https://main--eds-spin-landingpage--techdivision.hlx.page/
- Live: https://main--eds-spin-landingpage--techdivision.hlx.live/

## Installation

```sh
npm i
```

## Linting

```sh
npm run lint
```

## Local development

1. Create a new repository based on the `helix-project-boilerplate` template and add a mountpoint in the `fstab.yaml`
1. Add the [helix-bot](https://github.com/apps/helix-bot) to the repository
1. Install the [Helix CLI](https://github.com/adobe/helix-cli): `npm install -g @adobe/helix-cli`
1. Start Franklin Proxy: `hlx up` (opens your browser at `http://localhost:3000`)
1. Open the `{repo}` directory in your favorite IDE and start coding :)

## Delete Cache/Code (sometimes required if resources are not found)
{GitHub Token} = Token auf https://github.com/settings/tokens mit scope `repo` generieren lassen. Anschließend löschen.  
{Branch} = branch

Mehr Infos: https://www.hlx.live/docs/admin.html#tag/code/operation/codeStatus

```sh
curl -X POST "https://admin.hlx.page/code/techdivision/eds-spin-landingpage/{branch}/*?branch={branch}" -H "x-github-token: {GitHub token}"
```
Als Antwort wird bei einem Erfolg ein json Objekt übertragen

