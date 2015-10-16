This project is a development kit that can be used as a basis for the
customization of an OpenDataSoft portal. If you are an OpenDataSoft customer and
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
Create a `main.less` file in `src/less`. This is the file that will be compiled
and pushed to the platform. If you want to split your style in several files,
you need to import them in your `main.less` file.

Example
```less
@import "colors"; // Importing my color variables from colors.less

body {
    background-color: @background;
}
```

If you want to push your style to your portal:
```
gulp push
```
You can see the result of your work using the "Preview" button of the domain
theme page of your back-office, or just use the link that the command-line gave you.

You can also have a task running in the background to automatically push your
changes when you save a file:
```
gulp watch
```
