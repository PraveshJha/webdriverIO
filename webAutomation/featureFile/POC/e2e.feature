Feature: End to End Hotel Booking

        Scenario: Payment Information Page for multiple room
            Given I am on the Home page
             When I select 'HOTEL ONLY' tab
              And I select destination as 'London'
              And I select checkindate which is '20' days ahead from the present day with stay of duration '2'
              And I add guest '[{"Adults": 2,"Child": [1]}]' details
              And I click on Search button
             Then Hotel search results page should be displayed
             When I select any hotel
             Then Estab page should be displayed
             When I select all rooms
             Then Guest information page should be displayed
