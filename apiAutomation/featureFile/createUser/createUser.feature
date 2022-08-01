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
              And Response key '[id]' should not be null
              And Response key '[name]' should be '<userName>'
              And Response key '[email]' should be '<userEmail>'

        Scenario: Create New User with existing Data
            Given I update the payload for request 'createUser' with following details
                  | name  | <userName>  |
                  | email | <userEmail> |
             When I call 'post' request with endpoint 'public/v2/users'
             Then Response code should be '422'
              And Response key '[0][field]' should be 'email'
              And Response key '[0][message]' should be 'has already been taken'

        Scenario: Try to create new user for invalid format of email address
            Given I update the payload for request 'createUser' with following details
                  | email | i am invalid |
             When I call 'post' request with endpoint 'public/v2/users'
             Then Response code should be '422'
              And Response key '[0][field]' should be 'email'
              And Response key '[0][message]' should be 'is invalid'











