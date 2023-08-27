let arr = [
    { name: "SIlva", age: 3, score: { value: 1, a: "temp" }, rank: "A" },
    { name: "SIlva", age: 3, score: { value: 1 }, rank: "A" },
    { name: "SIlva", age: 3, score: { value: 2 }, rank: "C" },
    { name: "SIlva", age: 4, score: { value: 2 }, rank: "B" },
    { name: "Neymar", age: 3, score: { value: 3 }, rank: "D" },
    { name: "Neymar", age: 4, score: { value: 3 }, rank: "D" },
    { name: "Neymar", age: 4, score: { value: 3 }, rank: "F" },
]

function splitGroupFirstTime(groups, colName, nextCol) {
    let result = [], newGroups = []
    if(groups.length === 0) return { result, newGroups }

    result.push({ [colName]: groups[0][colName], parentIdx: null })
    newGroups.push([{ ...groups[0], parentIdx: result.length - 1 }])
    for (let i = 1; i < groups.length; i++) {
        const element = groups[i];
        if(element[colName] === groups[i-1][colName] && element[nextCol] !== groups[i-1][nextCol]){
            newGroups.push([{ ...element, parentIdx: result.length - 1 }])
            continue;
        }

        if(element[colName] !== groups[i-1][colName]) {
            newGroups.push([{ ...element, parentIdx: result.length }])
            result.push({ [colName]: element[colName], parentIdx: null })
            continue;
        }

        newGroups[newGroups.length - 1].push({ ...element, parentIdx: result.length - 1 })
        
    }
    return { result, newGroups }
}



function splitGroup(groups, colName, nextCol, colParam, nextColParam) {
    let data = [], newGroups = []
    for(let i = 0; i < groups.length; i++) {
        let firstDataGroup = colParam 
            ? { ...groups[i][0][colName] } 
            : { [colName]: groups[i][0][colName] }
        data.push({
            ...firstDataGroup,
            parentIdx: groups[i][0].parentIdx
        })
        newGroups.push([
            { ...groups[i][0], parentIdx: data.length - 1 }
        ])
        for(let j = 1; j < groups[i].length; j++) {
            const prevElement = groups[i][j-1]
            const element = groups[i][j]
            const currCellNextCol = nextColParam 
                ? element[nextCol][nextColParam] 
                : element[nextCol]
            const prevCellNextCol = nextColParam 
                ? prevElement[nextCol][nextColParam] 
                : prevElement[nextCol]
            if(currCellNextCol !== prevCellNextCol) {
                newGroups.push([
                    { ...element, parentIdx: data.length - 1 }
                ])
                continue;
            }
            newGroups[newGroups.length - 1].push({  
                ...element, parentIdx: data.length - 1
            })
        }
    }
    return { data, newGroups }
}

function splitGroupLastTime(groups, colName) {
    let result = []
    for(let i = 0; i < groups.length; i++) {
        for (let j = 0; j < groups[i].length; j++) {
            const element = groups[i][j];
            if(typeof (element[colName]) === 'object') {
                result.push({ ...element[colName], parentIdx: element.parentIdx })
            } else {
                result.push({ 
                    [colName]: element[colName], 
                    parentIdx: element.parentIdx 
                })
            }
        }
    }
    return result
}

let preGroup = splitGroupFirstTime(arr, "name", "age")
console.log(preGroup.result)
const firstResult = splitGroup(preGroup.newGroups, "age", "score", null, "value")
console.log("SCORES", firstResult.data)
const secondResult = splitGroup(firstResult.newGroups, "score", "rank", "value")
console.log("NAMES", secondResult.data)
console.log("Groups", secondResult.newGroups)
const thirdResult = splitGroupLastTime(secondResult.newGroups, "rank")
console.log(thirdResult)