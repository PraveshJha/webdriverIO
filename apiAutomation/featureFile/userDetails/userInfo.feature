Feature: Get User Details

        Scenario: Get User Info
             When I call 'get' request with endpoint '/public/v2' with following request parameter details
                  | users | 2683 |
             Then Response code should be '200'
          #     And Response key 'id' should be '2683'
          #     And Response key 'name' should not be null
          #     And Response key 'gender' should be 'male'








