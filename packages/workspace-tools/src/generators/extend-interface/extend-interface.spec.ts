import path from 'path';

import extendInterface from './extend-interface';

describe('extendInterface', () => {
    it('extends interface with other matching interfaces', async () => {
        const options = {
            inputPath:
                'packages/workspace-tools/src/generators/extend-interface/__fixtures__/**/index.ts',
            outputPath: path.join(__dirname, '/__temp__/output.ts'),
            outputMemberName: 'ExtendedInterface',
            memberPattern: '^Interface.$',
            targetPath:
                'packages/workspace-tools/src/generators/extend-interface/__fixtures__/foobar-interface/index.ts',
            targetMemberName: 'FoobarInterface',
            tsConfigPath:
                'packages/workspace-tools/src/generators/extend-interface/__fixtures__/tsconfig.json',
        };

        expect(await extendInterface(options))
            .toMatchSnapshot();
    });

    it('handles scenario where no matching interface is found', async () => {
        const options = {
            inputPath: path.join(__dirname, '/__fixtures__/**/index.ts'),
            outputPath: path.join(__dirname, '/__temp__/output.ts'),
            outputMemberName: 'ExtendedDummyInterface',
            memberPattern: '^DummyInterface.$',
            targetPath:
                'packages/workspace-tools/src/generators/extend-interface/__fixtures__/foobar-interface/index.ts',
            targetMemberName: 'FoobarInterface',
            tsConfigPath:
                'packages/workspace-tools/src/generators/extend-interface/__fixtures__/tsconfig.json',
        };

        expect(await extendInterface(options))
            .toMatchSnapshot();
    });
});
