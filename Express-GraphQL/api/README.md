# Firecamp GraphQL Echo Server

GraphQL Echo Server tests out all features of GraphQL client

Schema is saved in `schema.graphql` 
* There are 2 objects : 1 of type `Company` and other of type `File` to handle file uploads
 * <b>Queries :</b>
    * `company` : To display single company based on `company_id` given as input
    * `company_list` : To display list of all companies
 * <b>Mutations :</b>
    * `addCompany` : Add a company(given as user input) to the list of companies
    * `deleteCompany` : Delete a company(based on name of company as user input) from list of companies
    * `updateCompany` : Update a company(given as user input) in the list of companies
    * `singleUpload` : upload a single file
    * `multipleUpload` : upload multiple files

All requests are saved in Firecamp project

Here, `express-graphql` is used

All root resolvers and a static list of companies is saved in `main.js` 

### Usage
   * <b>Connection : </b>
   ```
   http://localhost:3000/graphql
   ```
   * <b> Queries</b> :
      * Display single company : 
      ```
      query getSingleCompany($companyid: ID!) {
        company(id: $companyid) {
          id
          name
          ceo
          cto
          coo
          headquarters
          employees
        }
     }
      ```
      * Display all companies : 
      ```
      query allCompanyList {
        company_list {
          id
          name
          ceo
          cto
          coo
          employees
          headquarters
        }
      }
      ```
   * <b>Mutations : </b>
       * Delete a company : 
       ```
       mutation deleteCompany($name: String!) {
        deleteCompany(name: $name) {
          id
          name
          ceo
          cto
          coo
          employees
          headquarters
        }
      }
       ```
       * Add a company : 
       ```
       mutation addCompany($name: String!, $ceo: String, $coo: String, $employees: Int, $headquarters: String) {
        addCompany(name: $name, ceo: $ceo, coo: $coo, employees: $employees, headquarters: $headquarters) {
          id
          name
          ceo
          cto
          coo
          employees
          headquarters
        }
      }
       ```
       * Update a company : 
       ```
       mutation updateCompany($name: String!, $ceo: String, $coo: String, $employees: Int, $headquarters: String) {
        updateCompany(name: $name, ceo: $ceo, coo: $coo, employees: $employees, headquarters: $headquarters) {
          id
          name
          ceo
          cto
          coo
          employees
          headquarters
        }
      }
       ```
       * Single File Upload : 
       ```
       mutation singleUpload($file: Upload!) {
        singleUpload(file: $file) {
          filename
          mimetype
          encoding
        }
      }
       ```
       * Multiple File Upload : 
       ```
       mutation multipleUpload($files: [Upload!]!) {
        multipleUpload(files: $files) {
          filename
          mimetype
          encoding
        }
      }
       ```



