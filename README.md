# Codyhouse Framework Trials

## _02_codyframe-theme-004 Template by 🐞 CodyHouse

_02_codyframe-theme-004 is a free HTML, CSS, JS landing template built using the [CodyHouse Components](https://codyhouse.co/ds/components) and [Framework](https://codyhouse.co/ds/get-started).

This template was created by copying and pasting 26 components, distributed across 5 unique pages. The global styles were defined using the Global Editors. The glue that holds the components together is CodyFrame. Nothing more - not a single extra line of CSS/JS! 🙌

[View Demo](https://therkut.github.io/_02_codyframe-theme-004)


## CodyHouse UI
First time you hear about CodyHouse UI? Here are a few links to get started:

- ⚙️ CodyFrame is a lightweight front-end framework for building accessible, bespoke interfaces. ([Learn more](https://codyhouse.co/ds/docs/framework) or [download it on Github](https://github.com/CodyHouse/codyhouse-framework))
- 📦 CodyHouse Components is a library of accessible, progressively enhanced, HTML, CSS, JS components that work seamlessly with CodyFrame. ([Browse components](https://codyhouse.co/ds/components))
- 🚀 Global Editors, a collection of web design tools to create and export typography elements, color themes, spacing rules, buttons and forms. ([Explore Globals](https://codyhouse.co/ds/globals))
- 📝 Documentation, learn how to use CodyFrame and the Components ([View documentation](https://codyhouse.co/ds/get-started))

## Progressive enhancement
The following script in the `<head>` of the html files:

```html
<script>document.getElementsByTagName("html")[0].className += " js";</script>
```

is used in CSS to check if JavaScript is enabled and apply additional style accordingly.

## Gulp
The template includes a Gulp file with some basic configurations needed to run a web project based on CodyFrame.

To use this Gulp configuration file, once you have downloaded the template, make sure to run the following commands in your command line:

```
npm install
npm run gulp watch
```

The first command will install the modules the framework requires for compiling SCSS into CSS; the second will launch your project on a development server.


- Optionally, you can use the gulp dist command to:
 - Compress your style file, purge it using PurgeCSS, and copy it to the 'dist' folder;
 - Compress your JS files and copy them to the 'dist' folder;
 - Copy your assets and html files to the 'dist' folder.

```
npm run gulp dist
```

## License
Check [CodyHouse License page](https://codyhouse.co/license#templates).

## Credits
1. Images: [Unsplash](https://unsplash.com/)
2. Icons: [Nucleoapp](https://nucleoapp.com/)
