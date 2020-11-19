import * as fs from "https://deno.land/std@0.76.0/fs/mod.ts"
import * as path from "https://deno.land/std@0.76.0/path/mod.ts"
import * as Colors from "https://deno.land/std@0.76.0/fmt/colors.ts"

async function getConfig<T>(subdir: string, moduleName: string, def: T): Promise<T> {
    let configPath = path.join(Deno.cwd(), subdir, "config", moduleName + ".json");
    let configFolder = path.join(Deno.cwd(), subdir, "config")
    let pathExists = await fs.exists(configFolder);
    if (!pathExists) {
        await Deno.mkdir(configFolder)
    }
    let configExists = await fs.exists(configPath);
    if (configExists) {
        try {
            let readConfig = await Deno.readTextFile(configPath);
            let parsed = JSON.parse(readConfig) as T;

            let keys: (keyof T)[] = Object.keys(def) as any
            for (let i = 0; i < keys.length; i++) {
                let key = keys[i];
                if (parsed[key] === undefined) {
                    let combo = {...def, ...parsed}
                    let stringed = JSON.stringify(def, undefined, 4);
                    await Deno.writeTextFile(configPath, stringed);
                    console.error(Colors.red(Colors.bold(`Config for module ${subdir}/${moduleName} is missing parameters, check file written to disk!`)))
                    Deno.exit(1);
                }
            }
            return parsed;
        } catch (e) {
            console.error("Could not read config for " + moduleName + "!")
            throw(e);
        }
    } else {
        try {
            let stringed = JSON.stringify(def, undefined, 4);
            await Deno.writeTextFile(configPath, stringed);
        } catch (e) {
            console.error("Could not write default config for " + moduleName + "!");
            throw(e);
        }
        console.error(Colors.red(Colors.bold(`No config for module ${subdir}/${moduleName}, please check the default config written to disk!`)))
        Deno.exit(1);
    }
}

export default getConfig;