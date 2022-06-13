"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findNext = void 0;
const findNext = async (tableName, column = "id", options) => {
    const tempOptions = options ? options : {};
    const max = (await tableName.max(column, tempOptions)) || 0;
    return max + 1;
};
exports.findNext = findNext;
/* export const getUnique = (array: any[]) => {
  return array.filter((value, index, self) => self.indexOf(value) === index);
};

 */
//# sourceMappingURL=functions.js.map