Feature: Create New User

        Scenario: Create New User
            Given I update the payload for request 'createUser' with following details
                  | name   | <TestData.name>  |
                  | gender | male             |
                  | email  | <TestData.email> |
              And I save Request body key 'name' in variable 'userName'
              And I save Request body key 'email' in variable 'userEmail'
             When I call 'post' request with endpoint 'public/v2/users'
             Then Response code should be '201'
              And I save Response body key '[id]' in variable 'userId'
              And Response key '[id]' should not be null
              And Response key '[name]' should be '<userName>'
              And Response key '[email]' should be '<userEmail>'

        Scenario: Try to create new user for invalid format of email address
            Given I update the payload for request 'createUser' with following details
                  | email | i am invalid |
             When I call 'post' request with endpoint 'public/v2/users'
             Then Response code should be '422'
              And Response key '[0][field]' should be 'email'
              And Response key '[0][message]' should be 'is invalid'

        Scenario: Update new user
            Given I update the payload for request 'createUser' with following details
                  | name  | Hacthon User |
                  | email | <userEmail>  |
             When I call 'patch' request with endpoint 'public/v2/' with following request parameter details
                  | users | <userId> |
             Then Response code should be '200'
              And Response key '[name]' should be 'Hacthon User'














