This project is a development kit that can be used as a basis for the
customization of an Opendatasoft portal. If you are an Opendatasoft customer and
you want to edit your domain's theme (CSS), you can either do it from the
online editor in your back-office, or use this development kit to do it from
your computer using your own tools, and push the result.

Benefits of using this kit over the online editor:
- you can write LESS, instead of regular CSS. This gives you access to variables,
mixins...
- you can separate your LESS file in multiple files, making it easier to maintain
- your LESS file is compiled, cleaned, and enhances through the use of autoprefixer
which automatically handles browser prefixes for you

### Setup
[Download the content of this repository.](https://github.com/opendatasoft/ods-portal-devkit/archive/master.zip)

Install the dependencies:
```
npm install
```

For more convenience, it is recommended to install gulp globally on your
environment:
```
npm install gulp -g
```

Copy `config.example.js` to `config.js` and edit the content.

### Usage
You need to create a main LESS file. This is the file that will be compiled
and pushed to the platform. If you want to split your style in several files,
you need to import them in this file.

Example
```less
@import "colors"; // Importing my color variables from colors.less

body {
    background-color: @background;
}
```

If you want everything to work out of the box, you can create a `main.less` file
in the `src/less` folder; this is the default place where the development kit
tries to find the files by default.

If you want to push your style to your portal:
```
gulp push
```
Or if your main LESS file is not `src/less/main.less`:
```
gulp push --lessfile myproject/myfile.less
```
You can see the result of your work using the "Preview" button of the domain
theme page of your back-office, or just use the link that the command-line gave you.

You can also have a task running in the background to automatically push your
changes when you save a file:
```
gulp watch
```
Or if your LESS files are not in `src/less/`, you can configure the path to the
main LESS file and to the folder that needs to be watched:
```
gulp watch --lessfile myproject/myfile.less --lesswatchdir myproject/
```
