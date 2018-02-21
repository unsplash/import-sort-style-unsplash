import {IStyleAPI, IStyleItem, IStyle} from "import-sort-style";
import { IImport } from "import-sort-parser";

const style: IStyle = (styleApi: IStyleAPI, file): Array<IStyleItem> => {
  const {
    alias,
    and,
    or,
    dotSegmentCount,
    hasNoMember,
    isAbsoluteModule,
    isNodeModule,
    isInstalledModule,
    isRelativeModule,
    moduleName,
    naturally,
    unicode,
  } = styleApi;
  const isComponentsFolder = (imported: IImport) =>
    imported.moduleName.startsWith("components/")
    || imported.moduleName.startsWith("client/components/")
    || imported.moduleName.startsWith("server/components/");
  const isNotComponentsFolder = (imported: IImport) => !isComponentsFolder(imported);

  return [
    // import "foo"
    {match: and(hasNoMember, isAbsoluteModule)},
    {separator: true},

    // import "./foo"
    {match: and(hasNoMember, isRelativeModule)},
    {separator: true},

    // import … from "fs";
    {
        match: or(isNodeModule, isInstalledModule(file!)),
        sort: moduleName(naturally),
        sortNamedMembers: alias(unicode),
    },
    {separator: true},

    // import … from "foo";
    {
      match: and(isAbsoluteModule, isNotComponentsFolder),
      sort: moduleName(naturally),
      sortNamedMembers: alias(unicode),
    },
    { separator: true },

    // import … from "{client/,server/,}components/foo";
    { match: isComponentsFolder, sort: moduleName(naturally), sortNamedMembers: alias(unicode) },
    { separator: true },

    // import … from "./foo";
    // import … from "../foo";
    {match: isRelativeModule, sort: [dotSegmentCount, moduleName(naturally)], sortNamedMembers: alias(unicode)},
    {separator: true},
  ];
};

export default style;
