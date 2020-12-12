let express = require('express');
let router = express.Router();
let fs = require('fs');
let path = require('path');
let express_graphql = require('express-graphql');
let { buildSchema } = require('graphql');
let { GraphQLUpload } = require('apollo-upload-server')
const { graphqlUploadExpress } = require('graphql-upload');
let { loadSchemaSync } = require('@graphql-tools/load');
let { GraphQLFileLoader } = require('@graphql-tools/graphql-file-loader');
let { addResolversToSchema } = require('@graphql-tools/schema');
let my_schema = fs.readFileSync(path.join(__dirname , 'schema.graphql'));


/*define GraphQL Schema which consist of a Company object and a File object(for file uploads). 
The 3 queries are : to display single company, to display multiple files and to handle file uploads. 
The Mutations are to : add,delete and update a company in company list, and for single and multiple file uploads.*/
let schema = buildSchema(my_schema.toString());


//Company list JSON array
let companyData = [
    {
        id : 1,
        name : 'SpaceX',
        ceo : 'Elon Musk',
        cto : 'Tom Mueller',
        coo : 'Gwynne Shotwell',
        employees : 8000,
        headquarters : 'Hawthorne,California,United States'
    },
    {
        id : 2,
        name : 'Tesla',
        ceo : 'Elon Musk',
        cto : 'JB Steaubel',
        employees : 48016,
        headquarters : 'Palo Alto, California, U.S.'
    }
];

//resolver to return single company based on its id from company list
let getcompany = (args) => {
    let id = args.id;
    let ans =  companyData.filter(company => {                                          
        return company.id == id;                                   //find company with id same as id goven by user            
    })[0];
    if(ans == undefined) {
        let obj = {};
        obj.id = "Company with given id doesn't exist";
        return obj;
    } else {
        return ans;
    }
}

//resolver to return all companies from company list
let allcompany = (args) => {
    if(args.name) {
        return companyData.filter(company => company.name == args.name)
    } else {
        return companyData;
    }
}

//resolver to add a company to the company list,  whose info is given by user
let addCompany = (args) => {
    let companyCount = companyData.length;
    const obj = {                                       //create a Company type object from info provided by user
        id : `${++companyCount}`,
        name : args.name,
        ceo : args.ceo,
        cto : args.cto,
        coo : args.coo,
        headquarters : args.headquarters,
        employees : args.employees
    }
    companyData.push(obj);                              //add the created Company type object to company list
    return obj;
}

//resolver to delete compnany from company list based on company name provided by user.
let deleteCompany = (args) => {
    let obj = companyData.filter(company => {
        return company.name == args.name;               //find company with company name same as name provided by user
    })[0];
    let index = companyData.indexOf(obj);
    companyData.splice(index,1);                        //delete company from company list, if found
    return obj;
}

//resolver to update company in company list based on the new info given by user
let updateCompany = (args) => {
    let obj = companyData.filter(company => {
        return company.name == args.name;               //find Company to be updated
    })[0];
    for(x in args) {
        if(args[x]==null) {
            delete args[x];
        }
    }
    for(x in args) {                    
        obj[x] = args[x];                               //update info of Company as specified by user       
    }
    return obj;
}

//resolver to handle single file  upload
let singleUpload = async ({file}) => {
    let {createReadStream, filename, mimetype, encoding} = await file;          //fetch file from user upload
    console.log(file);
    console.log('end');
    return {filename, mimetype, encoding};
}
 
//resolver to handle multiple files upload
let multipleUpload = async ({files}) => {
    let ans = [];
    files.filter(async file => {
        let {createReadStream, filename, mimetype, encoding} = await file;          //fetch each file from user upload
        ans.push({createReadStream, filename, mimetype, encoding});                 //add info og each file to ans array
    })
    return ans;                                                                     //return ans array which contains info of all files uploaded
}

//define root resolvers
let root = {
    company : getcompany,
    company_list : allcompany,
    addCompany : addCompany,
    deleteCompany : deleteCompany,
    updateCompany : updateCompany,
    Upload : GraphQLUpload,
    singleUpload : singleUpload,
    multipleUpload : multipleUpload    
};

router.use('/', graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }),express_graphql({
    schema : schema,
    rootValue : root,
    graphiql : true
}));

module.exports = router;