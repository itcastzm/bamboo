const fs = require('fs');
const path = require('path');

// 查询文件夹中所有文本文件内容  并以对象形式返回
function getAllFileContent(map_content, rootBase, curBase) {

    let cur_path = path.join(rootBase, curBase);
    if (fs.existsSync(cur_path)) {
        let files = fs.readdirSync(cur_path);
        files.forEach((file, index) => {
            let file_path = path.join(cur_path, file);
            if (fs.statSync(file_path).isDirectory()) {
                getAllFileContent(map_content, rootBase, `${curBase}${file}/`); //递归查询文件夹
            } else {
                map_content[`${curBase}${file}`] = fs.readFileSync(file_path, 'utf8');
            }
        });
    }

    return map_content;

}


export {
    getAllFileContent
}