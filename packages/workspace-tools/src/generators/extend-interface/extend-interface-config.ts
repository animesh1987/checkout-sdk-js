export default interface ExtendInterfaceConfig {
    entries: ExtendInterfaceConfigEntry[];
    tsConfigPath: string;
}

export interface ExtendInterfaceConfigEntry {
    inputPath: string;
    outputPath: string;
    outputMemberName: string;
    memberPattern: string;
    targetPath: string;
    targetMemberName: string;
}
