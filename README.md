angular2-seed
===

*Requires Node >= 0.12*

## Included
This includes angular2 built with webpack and has testing setup. It has the the ability to upload to S3.
If you do not wish to upload to S3 make sure to disable that part of the config in the webpack config.

##### Directives
Comes with a few directives
- Modal
- Form-save

##### Styles
Uses ITCSS styles and has setup for that. Also a few helper classes and btn, forms and resets
and other useful things

## Getting Started
When you start the application it will be setup on port `4000`

###### Steps
- Run `npm install` in root directory
- Run `npm link` (or prefix all commands with ./bin/.compiled/webpack-ng2-seed instead of just webpack-ng2-seed)
- Run `mv .env.sample .env` and fill in the strings

## Commands
This seed makes use of a cli tool. Run `webpack-ng2-seed` to see a list of options.

## Vendor Imports
To add a global file such as `angular2/core` that add it to `vendors.json`

## Things to Note
When in sass files and need variables and includes use `@import 'myModule/path';
By default `rxjs/add/operators/map` is imported to include map for HTTP. Make sure to remove this if unwanted.
