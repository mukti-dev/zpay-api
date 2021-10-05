const { findOperatorRecords } = require("../managers/dataTable.manager");

const operatorList = async (req, res) => {
    const postData = JSON.parse(JSON.stringify(req.body));
    let draw = postData.draw;
    let row = postData.start;

    let rowperpage = postData.length; // Rows display per page
    let columnIndex = postData["order[0][column]"];// Column index
    let columnName = postData['columns[' + columnIndex + '][data]'];// Column name

    //console.log(postData["columns[0][data]"]);
    let columnSortOrder = postData['order[0][dir]'];// asc or desc
    let searchValue = postData['search[value]']// Search value
    let totalRecords = 0
    let filter = {
        skip: row,
        limit: rowperpage,
        document: columnName,
        sort: columnSortOrder
    }
    totalRecords = await findOperatorRecords(searchValue, filter, 'count')
    let totalRecordwithFilter = totalRecords
    let records = await findOperatorRecords(searchValue, filter, 'records')
    // console.log(records)

    let data = []
    for (let i = 0; i < records.length; i++) {
        let obj = {
            sl_no: i + 1,
            operatorCode: records[i].operatorCode,
            name: records[i].name,
            cashbackPercentageForZpay: records[i].cashbackPercentageForZpay + ' %',
            cashbackPercentageForCustomer: records[i].cashbackPercentageForCustomer + ' %',
            status: records[i].status,
            action: ` <a href="javascript:void(0)" routerLink="operator-edit/${records[i]._id}" class="btn btn-info btn-xs">
                <span class="fa fa-pencil"></span> Edit</a> <button onclick=onDeleteOperatorClick('${records[i]._id}')
                                            class="btn btn-danger btn-xs"><span class="fa fa-trash"></span>
                                            Delete</button>`
        }
        data.push(obj)
    }

    const response = {
        "draw": draw,
        "iTotalRecords": totalRecords,
        "iTotalDisplayRecords": totalRecordwithFilter,
        "aaData": data
    }
    // console.log(response)
    // console.log(records)
    res.json(response)


}

module.exports = { operatorList }