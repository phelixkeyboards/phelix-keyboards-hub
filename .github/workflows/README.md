# Running Workflows Locally with `act`

This repository contains GitHub Actions workflows that can be executed locally using `act`. `act` is a command-line tool that allows you to run GitHub Actions workflows locally, providing a fast and convenient way to test your workflows before pushing changes to your repository.

## Prerequisites

Before you can run workflows locally with `act`, make sure you have the following prerequisites installed on your machine:

- [Docker](https://www.docker.com/get-started)
- [act](https://github.com/nektos/act#installation)

## Running Workflows

To run a workflow locally, follow these steps:

1. Clone the repository to your local machine:

    ```bash
    git clone https://github.com/your-username/your-repo.git
    ```

2. Change into the repository directory:

    ```bash
    cd your-repo
    ```

3. Install the necessary dependencies:

    ```bash
    npm install
    ```

4. Run the workflow using `act`:

    ```bash
    act
    ```

    This command will execute the default workflow defined in the `.github/workflows` directory.

    If you want to run a specific workflow, you can specify it using the `--workflow` flag:

    ```bash
    act --workflow my-workflow.yml -P self-hosted=catthehacker/ubuntu:act-latest
    ```

    Replace `my-workflow.yml` with the name of the workflow file you want to run.

That's it! You can now run GitHub Actions workflows locally using `act`. This allows you to test and debug your workflows before pushing changes to your repository.

For more information on using `act`, refer to the [official documentation](https://github.com/nektos/act).


#### This is broken...

```sh
| > pkh@1.0.0 postinstall
| > electron-rebuild --force
| 
| - Searching dependency tree
| (node:136) [DEP0060] DeprecationWarning: The `util._extend` API is deprecated. Please use Object.assign() instead.
| (Use `node --trace-deprecation ...` to show where the warning was created)
| Package libusb-1.0 was not found in the pkg-config search path.
| Perhaps you should add the directory containing `libusb-1.0.pc'
| to the PKG_CONFIG_PATH environment variable
| No package 'libusb-1.0' found
| make: Entering directory '/Users/travis/projects/phelix-keyboards-hub/node_modules/node-hid/build'
|   CC(target) Release/obj.target/hidapi/hidapi/libusb/hid.o
| ../hidapi/libusb/hid.c:43:10: fatal error: libusb.h: No such file or directory
|    43 | #include <libusb.h>
|       |          ^~~~~~~~~~
| compilation terminated.
| make: *** [hidapi.target.mk:122: Release/obj.target/hidapi/hidapi/libusb/hid.o] Error 1
| make: Leaving directory '/Users/travis/projects/phelix-keyboards-hub/node_modules/node-hid/build'
| Error: `make` failed with exit code: 2
|     at ChildProcess.onExit (/Users/travis/projects/phelix-keyboards-hub/node_modules/node-gyp/lib/build.js:203:23)
|     at ChildProcess.emit (node:events:520:28)
|     at ChildProcess._handle.onexit (node:internal/child_process:294:12)
| 
| ✖ Rebuild Failed
| 
| An unhandled error occurred inside electron-rebuild
| node-gyp failed to rebuild '/Users/travis/projects/phelix-keyboards-hub/node_modules/node-hid'
| 
| Error: node-gyp failed to rebuild '/Users/travis/projects/phelix-keyboards-hub/node_modules/node-hid'
|     at ChildProcess.<anonymous> (/Users/travis/projects/phelix-keyboards-hub/node_modules/@electron/rebuild/lib/module-type/node-gyp/node-gyp.js:118:24)
|     at ChildProcess.emit (node:events:520:28)
|     at ChildProcess._handle.onexit (node:internal/child_process:294:12)
| npm error code 255
| npm error path /Users/travis/projects/phelix-keyboards-hub
| npm error command failed
| npm error command sh -c electron-rebuild --force
| 
| npm error A complete log of this run can be found in: /root/.npm/_logs/2024-06-08T18_46_00_338Z-debug-0.log
[NodeJS with Webpack/build]   ❌  Failure - Main Install dependencies
[NodeJS with Webpack/build] exitcode '255': failure
[NodeJS with Webpack/build] 🏁  Job failed
````