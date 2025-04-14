import browserify from 'browserify';
import babelify from 'babelify';
import fs from 'fs';

const out = fs.createWriteStream('./browser.js');

browserify('./src/index.ts', {
    standalone: 'JSONStringifyDate',
    browserField: false,
})
    .transform(babelify, {
        extensions: ['.ts'],
        presets: [
            [
                '@babel/preset-env',
                {
                    targets: {
                        browsers: ['last 2 versions', 'ie >= 11'],
                    },
                    modules: 'auto',
                },
            ],
            '@babel/preset-typescript',
        ],
    })
    // .plugin(esmify)
    .bundle()
    .on('error', (err) => {
        console.error(err);
        process.exit(1);
    })
    .pipe(out);
