# Fantasy-K-League

## Overview
This was my final project whilst enrolling on General Assembly’s Software Engineering Immersive Course. For this project, I used a Python Django API using Django REST framework served from a Postgres database for the back-end and React for the front-end. This application was based on a self-made database that consumes up-to-date results of the Korean football league (K-League). It allows users to register, select their own team, login, view their team, view their world rankings, and gain current information about the players using CRUD functionality.

## Requirements
- Build a full-stack application by making your own backend and your own front-end
- Use a Python Django API using Django REST Framework to serve your data from a Postgres database
- Consume your API with a separate front-end built with React
- Be a complete product which most likely means multiple relationships and CRUD functionality for at least a couple of models
- Implement thoughtful user stories/wireframes that are significant enough to help you know which features are core MVP and which you can cut
- Have a visually impressive design to kick your portfolio up a notch and have something to wow future clients & employers.
- Be deployed online so it's publicly accessible.

## Timeframe
The timeframe given for this project was 10 days. This was a solo project.

## Technologies Used
- JavaScript
- HTML
- React
- SASS
- VS Code
- Insomnia
- Trello
- Figma
- JSX
- Axios
- React-Router-Dom
- Git
- GitHub
- Netlify
- Python
- Django
- PostgreSQL
- TablePlus
- QuickDatabaseDiagrams
- Cloudinary

## Deployed Project Link
https://fantasy-k-league.herokuapp.com/ 

Please sign up to experience all of the functions.

![Screen Grab of finished version](/client/src/images/fkl.gif)

## Plan
- For my final project of the course, I have decided to create something that I wanted to build even before the course has started, a Fantasy Football website using K-League (Korean football league) data. As I now have enough knowledge to create and build the back-end using Python and Django, I thought that now would be a great time to start building this application.

### Wireframe
- Here is the link to our Figma wireframe: [Link](https://www.figma.com/file/2eYDn9IgIcuLyo3T6h3AY8/Project-4?node-id=0%3A1&t=ruulnTqaUVyp09Ei-1)

  ![Screen Grab of finished version](/client/src/images/wireframe.png)

- As shown in the wireframe, rules to a fantasy football game can be complex. I have implemented the exact rules based off of Fantasy Premier League to score the players: [FPL Rules](https://fantasy.premierleague.com/help/rules)

### Back-end
- There were numerous possibilities to build the models in the back-end. I have decided to land on four models: user (has all the user information), info (connected to users through a one-to-one relationship, saving the players that the user has selected and their points), player (information about the specific player), and team (information about the 12 teams). The relationships between these models are represented in the image below.

  ![Screen Grab of finished version](/client/src/images/models.png)

- For the weekly and total points earned for the players, I decided to manually input the data in my database. However, I have set the automated point system model as my stretch goal. The model and relationships are shown in the image below.

  ![Screen Grab of finished version](/client/src/images/models-stretch.png)

- The necessary routes for these models were POST register and login, GET all and single info, PUT info, and GET all players. These routes will be explained below with the front-end.

### Front-end
- For the front end, I have decided to make 6 pages as the minimum viable product: home, register, login, select team, my team, and standings. The register and login pages would use the POST register and login requests. When the user first registers, they need to choose 11 players as their team for the season. They are not allowed to select more than 3 players from the same team. Also, they are allowed to have a maximum of 1 goalkeeper, 5 defenders, 5 midfielders, and 3 forwards to make up their team. Here, I would need a GET all players request to display all the players in the database and a PUT users request to add players into the user’s player list. For my team page, a GET single user request is needed to display user information. Lastly, for the standings page, a GET all users request is needed to rank the players according to their earned points.

- My plan was to complete my MVP during the duration of 10 days. Therefore, I have organised a list of things to do using the Trello board. Further stretch goals are stated on the wireframe. I will aim to achieve all of these goals after the course.

  ![Screen Grab of finished version](/client/src/images/trello.png)

## Process
### Database
- I first created the database of K-league players that will be seeded as the base data. I used data from https://fbref.com/en/comps/55/K-League-1-Stats and input in a [Google spreadsheet](https://docs.google.com/spreadsheets/d/1JaM_qhFv-7PqMiVRZJDexSUy-Vri2SsP0F4jh0St5Qs/edit#gid=0) Within the spreadsheet, I altered the data so that it is in an object form that can be implemented within the seeds file in the back-end. Price and score data was input manually. I am continuously updating the points every week for realistic gameplay.

### ***Back-end***
### Exceptions
- Before starting the back-end section, I have set an exceptions.py file that checked all of the possible errors that may occur during requests and used a wrapper to wrap around each request within the models’ view files. The final exceptions file is below.

  ```python
  def exceptions(func):
   @wraps(func)

   def wrapper(*args, **kwargs):
       try:
           return func(*args, **kwargs)
       except (User.DoesNotExist, PermissionDenied) as e:
           print(e.__class__.__name__)
           print(e)
           return Response({ 'detail': 'Unauthorized' }, status.HTTP_403_FORBIDDEN)
       except (NotFound) as e:
           print(e.__class__.__name__)
           print(e)
           return Response(e.__dict__ if e.__dict__ else { 'detail': str(e) }, status=status.HTTP_404_NOT_FOUND)
       except (ValidationError, ImproperlyConfigured) as e:
           print(e.__dict__)
           return Response(e.__dict__ if e.__dict__ else { 'detail': str(e) }, status.HTTP_422_UNPROCESSABLE_ENTITY)
       except Exception as e:
           print(e.__class__.__name__)
           print(e)
           return Response(e.__dict__ if e.__dict__ else { 'detail': str(e) }, status.HTTP_500_INTERNAL_SERVER_ERROR)
  
   return wrapper
  ```

### Users
- After downloading the necessary files and setting up the project folder, I started with the basic users model and authentication. When creating the users model, I added the email field. 

  ```py
  from django.db import models
  from django.contrib.auth.models import AbstractUser

  # Create your models here.
  class User(AbstractUser):
    email = models.CharField(max_length=50)
  ```

- After serialising the model to be converted into an object form, I created the register and login POST routes. For the register route, the requested data was added, validated and saved to be returned. For the login route, the password was checked to see if they matched and a token was returned.

  ```py
  User = get_user_model()
  class RegisterView(APIView):
    # REGISTER ROUTE
    # Endpoint: POST /api/users/register/
    @exceptions
    def post(self, request):
        user_to_add = UserSerializer(data=request.data)
        user_to_add.is_valid(raise_exception=True)
        user = user_to_add.save()
        return Response(user_to_add.data, status.HTTP_201_CREATED)
    
  class LoginView(APIView):
    # LOGIN ROUTE
    # Endpoint: POST /api/users/login/
    @exceptions
    def post(self, request):
        email = request.data['email']
        password = request.data['password']
        user_to_login = User.objects.get(email=email)
        if not user_to_login.check_password(password):
            print('PASSWORDS DONT MATCH')
            raise PermissionDenied('Unauthorized')
        dt = datetime.now() + timedelta(days=7)
        token = jwt.encode({ 'sub':  user_to_login.id, 'exp': int(dt.strftime('%s')) }, settings.SECRET_KEY, algorithm='HS256')
        print('TOKEN ->', token)
        return Response({ 'message': f"Welcome back, {user_to_login.username}", 'token': token })
  ```

- Authentication was necessary for the put request when adding players into each user’s info model, as the user has to be logged in, in order to make this request. JWTAuthentication was used to check the user’s token and validate the user.

  ```py
  class JWTAuthentication(BaseAuthentication):
    def authenticate(self, request):
        print('HIT SECURE ROUTE')
        if not request.headers:
            return None
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return None
        if not auth_header.startswith('Bearer'):
            return None
        token = auth_header.replace('Bearer ', '')
        print('TOKEN ->', token)
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms='HS256')
            print('PAYLOAD ->', payload)
            user = User.objects.get(pk=payload.get('sub'))
        except jwt.exceptions.InvalidSignatureError as e:
            print(e.__class__.__name__)
            print(e)
            return None
        except User.DoesNotExist as e:
            print(e.__class__.__name__)
            print(e)
            return None
        
        return (user, token)
  ```

### Info
- The info model is a model that needs to be created when a user is registered and instantly creates the relationship with the registered user, as player selection, the user’s points, and budget needs to be set before entering the player selection page. Therefore, after creating the info model that has the budget field (players and points fields will be added on later when the player model is created), I built a one-to-one relationship (a relationship where a record in one entity is associated with exactly one record in another entity) with the user model.

  ```py
  class Info(models.Model):
      user = models.OneToOneField(
          settings.AUTH_USER_MODEL, 
          on_delete=models.CASCADE, 
          related_name='info'
      )
      budget = models.FloatField(default=65)
      gw_points = models.IntegerField(default=0)
      total_points = models.IntegerField(default=0)
  ```

- Then, within the register view, I brought in the info model and saved it when the POST request was achieved.

  ```py
  class RegisterView(APIView):
    # REGISTER ROUTE
    # Endpoint: POST /api/users/register/
    @exceptions
    def post(self, request):
        user_to_add = UserSerializer(data=request.data)
        user_to_add.is_valid(raise_exception=True)
        user = user_to_add.save()
        info = Info(user=user, budget=60)
        info.save()
        return Response(user_to_add.data, status.HTTP_201_CREATED)
  ```

- The GET all, single and PUT requests were created as below using the serialized info model.

  ```py
  # Create your views here.
  class InfoListView(APIView):
    permission_classes = (IsAuthenticatedOrReadOnly,)

    # GET ALL INFO
    # Endpoint: GET /api/info/
    @exceptions
    def get(self, request):
        info = Info.objects.all()
        serialized_info = InfoSerializer(info, many=True)
        return Response(serialized_info.data)
    
  class InfoDetailView(APIView):
    permission_classes = (IsAuthenticatedOrReadOnly,)
    # GET SINGLE INFO
    # Endpoint: GET /api/info/:pk/
    @exceptions
    def get(self, request, pk):
        info = Info.objects.get(pk=pk)
        serialized_info = InfoSerializer(info)
        return Response(serialized_info.data)
    
    # PUT SINGLE INFO
    # Endpoint: PUT /api/info/:pk/
    @exceptions
    def put(self, request, pk):
        info = Info.objects.get(pk=pk)
        serialized_info = InfoSerializer(info, request.data, partial=True)
        serialized_info.is_valid(raise_exception=True)
        serialized_info.save()
        return Response(serialized_info.data)
  ```

### Players
- The players model was set in the same way as the wireframe with name, position, price, gw_points, and total_points fields. 

  ```py
  class Player(models.Model):
   name = models.CharField(max_length=100)
   position = models.CharField(max_length=2)
   team = models.ForeignKey(
       'teams.Team',
       on_delete=models.CASCADE,
       related_name='players'
   )
   price = models.FloatField()
   gw_points = models.IntegerField()
   total_points = models.IntegerField()
   selected_users = models.ManyToManyField('info.Info', related_name='selected_players')

   def __str__(self):
       return f'{self.name} - {self.price}'
  ```

- A get request was done to get the list of players when selecting the team.

  ```py
  class PlayerListView(APIView):
  
  @exceptions
  def get(self, request):
      players = Player.objects.all()
      serialized_players = PlayerSerializer(players, many=True)
      return Response(serialized_players.data)
  ```

- Seeding of the data has been done through creating an object formatted column in the Google spreadsheet database and copying into the seeds file created.
  - Format: {'model': 'players.Player', 'pk': 1, 'fields': {'name': 'Martin Ádám', 'position': 'FW',"team": 12,'price': 7,'gw_points': 0, 'total_points': 6}},

### Teams
- I have added an abb(abbreviation) field to the teams model as an abbreviation of the team seemed to be necessary in the My Team page to show who they are facing next.

  ```py
  class Team(models.Model):
      name = models.CharField(max_length=100)
      abb = models.CharField(max_length=4)
      shirt_image = models.URLField(validators=[URLValidator()])
      next_match = models.CharField(max_length=8)


   def __str__(self):
      return f'{self.name} (vs {self.next_match})'
  ```

### Relationships
- After all the models were built, I linked the models with the necessary relationships.
- **Team - Player One-to-Many relationship**
  - As each player has a team field that needs to be stated, I have added the models.ForeignKey to the Player model as shown below:

    ```py
    class Player(models.Model):
        name = models.CharField(max_length=100)
        position = models.CharField(max_length=2)
        team = models.ForeignKey(
            'teams.Team',
            on_delete=models.CASCADE,
            related_name='players'
        )
        price = models.FloatField()
        gw_points = models.IntegerField()
        total_points = models.IntegerField()
        selected_users = models.ManyToManyField('info.Info', related_name='selected_players')
    ```
  
  - Then, I populated the Team model with the players of that team by creating a populated.py file in the serializers folder and populating the model with the players when serialized.

    ```py
    class PopulatedTeamSerializer(TeamSerializer):
        players = PlayerSerializer(many=True)
    ```

- **Player - Info Many-to-Many relationship**

  - For this many to many relationship, I have added a selected_users and selected_players field to each model and declared a ManyToManyField so that each model can share the information when the player is added to the selected_players list in the info of the user.

    ```py
    class Player(models.Model):
        name = models.CharField(max_length=100)
        position = models.CharField(max_length=2)
        team = models.ForeignKey(
            'teams.Team',
            on_delete=models.CASCADE,
            related_name='players'
        )
        price = models.FloatField()
        gw_points = models.IntegerField()
        total_points = models.IntegerField()
        selected_users = models.ManyToManyField('info.Info', related_name='selected_players')

    def __str__(self):
        return f'{self.name} - {self.price}'
    ```

  - Within the info model, a populated serializer was necessary, passing in the player serializer to the selected_players field.

    ```py
    from .common import InfoSerializer
    from players.serializers.common import Player, PlayerSerializer

    class PopulatedInfoSerializer(InfoSerializer):
        selected_players = PlayerSerializer(many=True)
    ```
  
  - However, as the selected_players list needs to be updated every time the request is made, I created an update function within the PopulatedInfoSerializer that can update the list with the players object. 
  - I first popped the selected_players field from the validated_data and looped through the array of ids and checked the matching player within the database with the same id. 
  - Then I added that player within the selected_players field. 
  - Also, it seemed necessary that when an id that already exists within the selected_players list in the user’s info, the player needs to be also removed, so that the user can select and deselect the player. Therefore, I created another for loop that iterates over the selected_player field when there is a player in the list of objects. 
  - I compared the ids and if the player with that id exists, I removed the player. If not, I added the player. Below is the code for the function.

    ```py
    def update(self, instance, validated_data):
        players_data = validated_data.pop('selected_players', [])
        existing_players = instance.selected_players.all()

        # When there is players in the selected_players list
        for existing_player in existing_players:
              if existing_player.id in [player_data['id'] for player_data in players_data] and existing_players:
                  instance.selected_players.remove(existing_player)
              else:
                  for player_data in players_data:
                      player_id = player_data.get('id')
                      player = Player.objects.get(id=player_id)
                      instance.selected_players.add(player)

        # When the list is empty, add the player straight in
        if not existing_players:
            for player_data in players_data:
                player_id = player_data.get('id')
                player = Player.objects.get(id=player_id)
                instance.selected_players.add(player)

        instance.save()
        return instance
    ```

  - However, when checking the validated_data within the passed selected players, the id was not returned. This happened because, although the primary key is automatically created, I needed to define the id field within the player model itself in order to pass the id field within the request, which will compare itself to the Player data’s id. Therefore, I added an id field within the Player model.

    ```py
    class PlayerSerializer(ModelSerializer):
    id = serializers.IntegerField(required=False)
    class Meta:
        model = Player
        fields = '__all__'
    ```
  
  - As the budget field is directly connected to the price of the players, I subtracted the price from the budget when the players are added and added it back when the player is removed. I also added a conditional to stop the function from running when the budget reaches 0 or lower.
  - Also, as there is a limit of maximum 3 players from the same team and a limit of 11 players that can be selected, a conditional was added as below to check the length of the list. For the same team checker, a Counter was imported to check how many of the players of the same team. If the team_counts reaches 3, then no more players can be added.
  - As the rule states that the user can only choose a maximum of 1 goalkeeper, 5 defenders, 5 midfielders, and 3 forwards, I set conditionals for this too.

    ```py
    if team_counts[player.team.name] == 3 or len(existing_players) == 11 
        or (player.position == 'GK' and position_counts['GK'] >= 1) 
        or (player.position == 'DF' and position_counts['DF'] >= 5) 
        or (player.position == 'MF' and position_counts['MF'] >= 5) 
        or (player.position == 'FW' 
        and position_counts['FW'] >= 3):
    ```
  
  - I finally reorgainsed the conditionals so that it first checks if there is a player within the existing players array. If not, the user can directly add the player. If there is, it checks the budget status, then if the selecting player is in the existing players array. Each of these conditionals had their own nested conditional which checked all the possible combinations of errors that may occur when abiding by the rule. The full code that covers these conditions are below.

    ```py
    class PopulatedInfoSerializer(InfoSerializer):
    selected_players = PopulatedPlayerSerializer(many=True)
    user = UserSerializer()

    def update(self, instance, validated_data):
        players_data = validated_data.pop('selected_players', [])
        existing_players = instance.selected_players.all()

        # Counts the number of teams so that it does not go over 3 players from the same team
        team_counts = Counter(existing_player.team.name for existing_player in existing_players)
        position_counts = Counter(existing_player.position for existing_player in existing_players)
        print(team_counts)

        # When there is players in the selected_players list
        if existing_players:
            for player_data in players_data:
                player_id = player_data.get('id')
                player = Player.objects.get(id=player_id)
                if instance.budget - player.price >= 0:
                    if player in existing_players:
                        instance.selected_players.remove(player)
                        instance.budget = round(instance.budget + player.price, 1)
                    else:
                        if team_counts[player.team.name] == 3 or len(existing_players) == 11 or (player.position == 'GK' and position_counts['GK'] >= 1) or (player.position == 'DF' and position_counts['DF'] >= 5) or (player.position == 'MF' and position_counts['MF'] >= 5) or (player.position == 'FW' and position_counts['FW'] >= 3):
                            raise PermissionDenied({'Cannot add player'})
                        else:
                            instance.selected_players.add(player)
                            instance.budget = round(instance.budget - player.price, 1)
                elif instance.budget - player.price < 0:
                    if player in existing_players:
                        instance.selected_players.remove(player)
                        instance.budget = round(instance.budget + player.price, 1)
                    else:
                        raise PermissionDenied({'Cannot add player'})

        # When the list is empty, add the player straight in
        if not existing_players:
            for player_data in players_data:
                player_id = player_data.get('id')
                player = Player.objects.get(id=player_id)
                instance.selected_players.add(player)
                instance.budget = round(instance.budget - player.price, 1)

        instance.save()
        return instance
    ```

  - I have finally populated the username field to use as the username within the get all info request in the rankings page.

    ```py
    class PopulatedInfoSerializer(InfoSerializer):
        selected_players = PopulatedPlayerSerializer(many=True)
        user = UserSerializer()
    ```
  
  - All of the InfoSerializers in the views were replaced with PopulatedInfoSerializer.

### Points Update
- Updating the points was tricky because the weekly points of the players were updated manually through my Google Spreadsheet database. First I would update all of the players’ weekly points through the spreadsheet and get the player objects. Then, I would move this within the seeds.json in the players folder with the updated gameweek points. After this, all of the user (info) points needed to be updated whenever I needed them to. Therefore, I needed a Python script that could be run to manually update all of the user’s gameweek points and the total points at the end of each gameweek. At the end the players’ points needed to be reset to zero. Below is the code for this.

  ```py
  def update_points():
      infos = Info.objects.all()

      for info in infos:
          total_gw_points = sum(player.gw_points for player in info.selected_players.all())
          info.gw_points = total_gw_points
          info.total_points += total_gw_points
          info.save()

      Player.objects.update(gw_points=0)

  if __name__ == '__main__':
      update_points()
      print("Points updated and reset successfully.")
  ```

- I later on divided this update function into three, because I wanted to first update the players gameweek points, update the total points, then remove the gw_points. This three step process would allow me to update the gameweek points during the actual gameweek without colliding with the total points update because if I continuously update the gameweek and total points using one python script, it will accumulate the total points on top of one another. I thought this would be best for user experience as they would want up-to-date information about the points their players have earned. 

### ***Front-end***
First, I set up the necessary files for the front-end using the SEI React template. Along with this, I’ve added react-bootstrap to format and style elements of the front-end. After setting up the App.js (which has the browser routes compiled), I started with the Home page.

### Home
- I have set the wireframe of the home page to be linked directly to only the register and login pages. Therefore, two buttons were set to navigate to either the register or the login routes.

  ```js
  const Home = () => {
    return (
      <main className="home">
        <div className='home-container'>
          <h1>FANTASY K-LEAGUE</h1>
          <p>New User? Register to play against all.</p>
          <p>Already signed up? Login in to continue playing.</p>
          <div className='homeButton'>
            <Button to="/register" as={Link} className='btn'>Register</Button>
            <Button to="/login" as={Link} className='btn'>Login</Button>
          </div>
        </div>
      </main>
    )
  }
  ```

### Register
- The register page needed a useState to set the form fields, a handleChange function to set the form fields as the text input, and the handleSubmit function that makes the post request. A slight addition I made into the handleSubmit was setting the local storage with the token as the user needs to be authenticated as soon as they register. This authentication process was necessary as the select teams page, which the user will enter next, needs authentication through the token in the local storage. Therefore, I modified the back end so that registering also passes down a token.

  ```py
  class RegisterView(APIView):
      # REGISTER ROUTE
      # Endpoint: POST /api/users/register/
      @exceptions
      def post(self, request):
          user_to_add = UserSerializer(data=request.data)
          user_to_add.is_valid(raise_exception=True)
          user = user_to_add.save()
          dt = datetime.now() + timedelta(days=28)
          token = jwt.encode({ 'sub':  user.id, 'exp': int(dt.strftime('%s')) }, settings.SECRET_KEY, algorithm='HS256')
          print('TOKEN ->', token)

          info = Info(user=user, budget=65)
          info.save()

          return Response({ 'data': user_to_add.data, 'token': token}, status.HTTP_201_CREATED)
  ```

- The user will then navigate to the ‘/teamselection/userid’ page. The user’s id was called through data.data.id. Below is the full handleSubmit code.

  ```js
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const { data } = await axios.post('/api/auth/register/', formFields)
      console.log(data)
      localStorage.setItem('Fantasy-K-League', data.token)
      navigate(`/teamselection/${data.data.id}`)
    } catch (err) {
      console.log(err.response.request.responseText)
      const errorMessage = err.response.request.responseText.replace('{"detail":{"non_field_errors":["', '').replace('"]}}', '').replace('{"detail":{"username":["', '')
      setRegisterError(errorMessage)
    }
  }
  ```

### Login
- Login also has a form field as a useState that will save the input email and password and pass it down to the post request when submitted. Here, however, the user will be directed straight to the My Team page (/myteam/${loggedInUser}). The user id will be called through the helper function loggedInUser, which gets the payload and returns the sub. The helper function can be found in helpers.auth.js.

  ```js
  export const loggedInUser = () => {
    const payload = getPayload()
    if (!payload) return
    return payload.sub
  }
  ```

### Team Selection
- After the user is registered, they first need to choose their team to begin playing fantasy football. Within this page, there are two major sections. The player selector that allows the user to select players and the selected players display which shows which players they have selected. Therefore, two main requests need to be made first: get players and info (which has the user’s data). 
- GET info was done within a useCallback so that the hook caches the value and does not recompute it every time. Also, the selected players data was saved within the selectedPlayers useState.

  ```js
  const getInfo = useCallback(async () => {
    try {
      const { data } = await authenticated.get(`/api/info/${loggedInUser()}/`)
      setInfo(data)
      setSelectedPlayers(data.selected_players)
      console.log(data.selected_players)
    } catch (err) {
      console.log(err)
      setInfoError(err.responseText)
    }
  }, [userId])
  ```

- GET player was done within a useEffect so that the players list is called when the page is loaded.
- Similarly with my previous project, another useCallback hook was passed down through App.js, which sets the user data. This allows the user to update the user information every time the useEffect is made so that the data received is not delayed. Therefore, the getUserInfo prop was passed down and added within the useEffect.

  ```js
  useEffect(() => {
    !isAuthenticated() && navigate('/')
    const getPlayers = async () => {
      try {
        const { data } = await authenticated.get('/api/players/')
        setPlayers(data)
        console.log(data)
      } catch (err) {
        console.log(err)
        setPlayersError(err.responseText)
      }
    }
    getInfo()
    getPlayers()
  }, [userId])
  ```

- I put a lot of thought into how I want to display the two main sections of this page. As a mobile display is crucial for my application, my conclusion was to show the selected players as the main display of my page and create buttons per position that has a modal that shows a list of players of that position.

- The most important function was selecting the player. For this function, I set a player parameter that can be passed through. After setting the correct formatted object of the selected_player key and the player’s id, I passed it through the put request. Within the put request, I modified the api link to be using the user ID rather than the primary key of that info object, because it seemed more plausible to utilise the loggedInUser helper function within the request. Therefore, I changed the info view as follows.

  ```py
  class InfoDetailView(APIView):
      permission_classes = (IsAuthenticated,)

      # GET SINGLE INFO
      # Endpoint: GET /api/info/:userId/
      @exceptions
      def get(self, request, user):
          info = Info.objects.get(user=user)
          ...continued code
  
      # PUT SINGLE INFO
      # Endpoint: PUT /api/info/:userId/
      @exceptions
      def put(self, request, user):
          info = Info.objects.get(user=user)
          ...continued code
  ```

- After making the put request, I set the data.selected_players to the selectedPlayers useState, which will be later mapped to show the selected players display. Here, the getUserInfo callback is also implemented to make the update of the user info when the player is selected.

  ```js
  const selectPlayer = async (player) => {
    try {
      const updatedInfo = {
        selected_players: [{ id: player.id }],
      }
      console.log(player)
      const { data } = await authenticated.put(`/api/info/${loggedInUser()}/`, updatedInfo)
      setInfo(data)
      setSelectedPlayers(data.selectesd_players)
      console.log('SELECTED PLAYERS ->', data.selected_players)
      getUserInfo()
      setShowModal(false)
    } catch (err) {
      console.log(err.response)
      setInfoError(err.response.request.responseText)
    }
  }
  ```

- Now, as the select player function was set, I needed to set how I’m going to show the list of players. As I did not want a long list of all the players on one modal, I separated the buttons into the necessary positions. To do this, I made an array that has ‘GK’, ‘DF’, ‘MF’, and ‘FW’ in it. I mapped through this array creating a button for each position. 

  ```js
  <div className='select-buttons'>
    {positions.map((position, i) => (
      <Button key={i} className='modal-button' value={position} onClick={() => handlePositionClick(position)}>Select {position}</Button>
    ))}
  </div>
  ```

- While mapping through, I set an onClick event which runs the handlePositionClick function. This function (with a position parameter) sets the selectedPosition useState as the clicked position and shows the modal by changing the showModal state to be true.

  ```js
  const handlePositionClick = (position) => {
    setSelectedPosition(position)
    setShowModal(true)
  }
  ```

- When entering the modal, the filtered array of the players in that specific position each had an onClick event that runs the selectPlayer function and makes the put request. While mapping through the players, I checked if the player was selected by the user and set different class names to style the rows differently.

  ```js
  {players.filter((player) => player.position === selectedPosition)
    .sort((a, b) => {
      if (sortField === 'price') {
        return (b.price - a.price) * sortOrder
      } else if (sortField === 'total_points') {
        return (b.total_points - a.total_points) * sortOrder
      }
      return 0
    })
    .map(player => {
      const { id, name, position, price, total_points, team: { logo: logo } } = player
      if (selectedPlayers.some(selectedPlayer => selectedPlayer.id === player.id)) {
        return (
          <tbody key={id}>
            <tr className='text-center selected' value={id} onClick={() => selectPlayer(player)}>
              <td className='text-start'><img className='logo' src={logo}></img>{name}</td>
              <td>{position}</td>
              <td>{price}</td>
              <td>{total_points}</td>
            </tr>
          </tbody>
        )
      } else {
        return (
          <tbody key={id}>
            <tr className='text-center' value={id} onClick={() => selectPlayer(player)}>
              <td className='text-start name'><img className='logo' src={logo}></img>{name}</td>
              <td>{position}</td>
              <td>{price}</td>
              <td>{total_points}</td>
            </tr>
          </tbody>
        )
      }
    })}
  ```

- I added a toggle for the price and total points columns so that the users can easily sort the players in whatever way they want. This was done through the sortField and sortOrder states which were changed when clicked. In accordance with these changes in values, the sort method was run within the table. The functions were applied within the table headers with a toggle image.

  ```js
  const togglePrice = () => {
    if (sortField === 'price') {
      setSortOrder(sortOrder * -1)
    } else {
      setSortField('price')
      setSortOrder(1)
    }
  }

  const togglePoints = () => {
    if (sortField === 'total_points') {
      setSortOrder(sortOrder * -1)
    } else {
      setSortField('total_points')
      setSortOrder(1)
    }
  }
  ```

- Finally, a handleSubmit function navigated the user to My Team. This function was allowed to run if the length of the selectedPlayers reached 11.

  ```js
  const handleSubmit = () => {
    if (selectedPlayers.length === 11) {
      navigate(`/myteam/${loggedInUser()}`)
    }
  }
  ```

- A final setting that I included within the team selection page was not enabling the user to access this page when they have passed submitting their team. Therefore, I created a new helper function that saves the user’s id in the local storage and checks whether the logged in user’s id and the id inside the local storage was the same.

  ```js
  export const cannotEnterTeamSelection = () => {
    const id = localStorage.getItem(userId)
    if (!id) return false
    if (id === loggedInUser().toString()) {
      console.log('false')
      return true
    }
  }
  ```

- Saving the user’s id to the local storage was implemented on handleSubmit in login and handleSubmit in team selection.
- Within the TeamSelection.js, I have added a conditional within useEffect to check if the user cannot enter team selection, using the helper function and if not, navigate them into their my teams page.

  ```js
  useEffect(() => {
    !isAuthenticated() && navigate('/')
    cannotEnterTeamSelection() && navigate(`/myteam/${loggedInUser()}`)
    ...continued code
  })
  ```

### My Team
- The My Team page was very similar to, or almost identical to the selected players of the team selection page, using the single info GET route to get the information and display it.

- An addition I made that was different from the team selection page’s selected players section was the Gameweek Points and Total Points at the top. I thought it would be useful to display the username, the current gameweek’s points, and their total points.

- The { replace: true } is added in the useEffect when checking for authentication and redirecting the user to the myteam page in that specific browser. This option allows the user to replace the history path of the navigation to the my team page so that the user cannot return to the login page using the back button.

  ```js
  useEffect(() => {
    if (isAuthenticated()) {
      navigate(`/myteam/${loggedInUser()}`, { replace: true })
    }
    const getInfo = async () => {
      try {
        const { data } = await authenticated.get(`/api/info/${loggedInUser()}/`)
        setInfo(data)
        setSelectedPlayers(data.selected_players)
        setUserInfo(data.user)
        console.log(data)
      } catch (err) {
        console.log('error ->', err.message)
        setInfoError(err.message)
      }
    }
    getInfo()
    getUserInfo()
  }, [userId])
  ```

- Finally, I restructured the players section into a separate component for better read of the code.

### Rankings
- The next page I worked on was the rankings page. This page used the GET all info route and ranked the entire players that were registered to the game.
- Like the select players modal, I have used a bootstrap table to create the rankings table. I have used the sort method to sort the players using their total_points key from the highest to lowest. Within the map, I have added an extra variable, rank, which is the index of the map of the array. Therefore, I used this variable and added 1 to it to create the players’ ranks.

  ```js
  const RankingsTable = ({ allInfo, setSelectedUser, setShowModal, setSelectedUserData }) => {
    const handleUserClick = (username) => {
      setSelectedUser(username)
      setShowModal(true)
      setSelectedUserData(allInfo.filter(info => info.user.username === username))
    }

    return (
      <Table hover className='rankings-table'>
        {/* Headers */}
        <thead>
          <tr className='text-center'>
            <th>Rank</th>
            <th>Username</th>
            <th>Gameweek Points</th>
            <th>Total Points</th>
          </tr>
        </thead>
        {/* Body */}
        {allInfo.sort((a, b) => b.total_points - a.total_points).map((userInfo, rank) => {
          const { id, gw_points, total_points, user: { username, id: userId } } = userInfo
          return (
            <tbody key={id} className={userId === loggedInUser() ? 'user' : ''} onClick={() => handleUserClick(username)}>
              <tr className='text-center'>
                <td>{rank + 1}</td>
                <td>{username}</td>
                <td>{gw_points}</td>
                <td>{total_points}</td>
              </tr>
            </tbody>
          )
        })
        }
      </Table>
    )
  }
  ```

- As I also wanted to display the specific user’s team when clicked on that user’s row, I have used a modal like the one in the Team Selection page. On the table row, it has a handleUserClick function (shown above) that has the same effect as the handleClick within the Team Selection page. However, I added an additional useState (selectedUserData) in order to set this state as the specific user’s data when clicked on the user’s row. Therefore, it would be easier to target that user’s information when clicking on the row and displaying the modal. Other than displaying the gameweek points of that user in the modal, everything had identical functionality with the players display in both the selected players section of Team Selection and the My Team page.

  ```js
  const RankingsModal = ({ showModal, setShowModal, selectedUser, allInfo, selectedUserData }) => {
    // ! Variables
    const positions = ['GK', 'DF', 'MF', 'FW']

    // ! Executions
    const handleClose = () => {
      setShowModal(false)
    }

    return (
      <Modal show={showModal} onHide={handleClose} className='pop-up'>
        <Modal.Header closeButton className='custom-modal'>
          <Modal.Title>{selectedUser}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {allInfo &&
            <>
              <div className='points'>
                <div className='points-section'>
                  <h3 className='point'>{selectedUserData[0].gw_points}</h3>
                  <p>GW Points</p>
                </div>
              </div>
              <div className='team'>
                {positions.map(position => {
                  return (
                    <div key={position} className='ranking-players'>
                      {allInfo.filter(info => info.user.username === selectedUser).map(user => {
                        const { selected_players } = user
                        return (
                          selected_players
                            .filter(player => player.position === position)
                            .map(player => {
                              const { id, name, team: { team: teamName, logo, next_match }, gw_points } = player
                              return (
                                <div key={id} className='player-single'>
                                  <img className='logo' src={logo} alt={`${teamName}`} />
                                  <p className='name'>{name}</p>
                                  <p className='gw-points'>{gw_points}</p>
                                  <p className='next-match'>{next_match}</p>
                                </div>
                              )
                            })
                        )
                      })}
                    </div>
                  )
                })}
              </div>
            </>
          }
        </Modal.Body>
      </Modal>
    )
  }
  ```

### Navbar
- The navbar was setted up in a similar format as my other projects. As the login, register, and team selection pages do not need a navbar, I created an array of routes(noNav) that does not need a navbar and wrapped the navbar. Within the return statement, I created a conditional that only allows the navbar to display if the location.pathname is not included within the “noNav” array of routes. Also, all of the routes ended with the logged in user’s id in order to differentiate the different pages in regards to the user who is playing the game.

### Player Stats
- Although I did not plan this page within the wireframe, I decided it would be best to add all the players’ statistics within a separate page so that the users can use that information. This page would be more useful when functions such as transfers are implemented.
- After setting the useEffect in calling the players using the GET players request, I have created a table that displays all of the players. I thought it would be good to have a button for each position, so I created a positions array like in the Team Selection page. However, here I had an ‘All’ variable which targets all of the players. This was also set as the default value within the useEffect.

  ```js
  // ! Variables
  const { userId } = useParams()
  const navigate = useNavigate()
  const positions = ['All', 'GK', 'DF', 'MF', 'FW']

  // ! State
  const [players, setPlayers] = useState(null)
  const [playersError, setPlayersError] = useState('')
  const [selectedPosition, setSelectedPosition] = useState('')
  const [mostExpensive, setMostExpensive] = useState([])
  const [mostGwPoints, setMostGwPoints] = useState([])
  const [mostTotalPoints, setMostTotalPoints] = useState([])

  // ! On Mount
  useEffect(() => {
    !isAuthenticated() && navigate('/')
    const getPlayers = async () => {
      try {
        const { data } = await authenticated.get('/api/players/')
        setPlayers(data)
        console.log(data)
        const highestPrice = Math.max(...data.map(player => player.price))
        const highestGwPoints = Math.max(...data.map(player => player.gw_points))
        const highestTotalPoints = Math.max(...data.map(player => player.total_points))
        setMostExpensive(data.filter(player => player.price === highestPrice))
        setMostGwPoints(data.filter(player => player.gw_points === highestGwPoints))
        setMostTotalPoints(data.filter(player => player.total_points === highestTotalPoints))
      } catch (err) {
        console.log(err)
        setPlayersError(err.response.statusText)
      }
    }
    getPlayers()
    getUserInfo()
    setSelectedPosition('All')
  }, [userId])
  ```

- In a similar format with the Team Selection page’s table within the modal, I have filtered each player according to the current selectedPosition useState value. This was changed every time a click was made. Toggles were added in a similar way of sorting the values in high-to-low or low-to-high order. In addition, the player stats page also had the gameweek points column as that value seemed important to users when they want to compare players.

- The final section of this page was displaying the leaders of price, gameweek points, and total points. In order to do this, I have added useStates that filtered the whole players’ data to only the highest values of each category when the page is loaded in useEffect as shown above.

- Each of these values were then used to display above the player table within the Player Stats page. For the Gameweek Points section, I created another conditional to capture the time point when all of the gameweek points were set back to zero. In this case, the most gameweek points will be all of the players. Therefore, when the length of the mostGwPoints array was equal to the whole length of players, I returned “Gameweek points has not been updated”.

  ```js
  return (
    <div className='header'>
      <h1>Player Stats</h1>
      <img src={playerImage} alt='playerImage' className='player-image' />
    </div>
    <div className='top-players'>
      <div className='top-players-container'>
        <h4>Most Expensive</h4>
        <div className='players'>
          {mostExpensive.map(player => {
            const { name, price, team: { logo }, id } = player
            return (
              <div className='player-single' key={id}>
                <img className='logo' src={logo}></img>
                <p>{name}</p>
                <p>{price}m</p>
              </div>
            )
          })}
        </div>
      </div>
      <div className='top-players-container'>
        <h4>Highest GW Points</h4>
        <div className='players'>
          {mostGwPoints.length === players.length ?
            <div className='player-single'>
              <p>Gameweek points has not been updated.</p>
            </div>
            :
            <>
              {mostGwPoints.map(player => {
                const { name, gw_points, team: { logo }, id } = player
                return (
                  <div className='player-single' key={id}>
                    <img className='logo' src={logo}></img>
                    <p>{name}</p>
                    <p>{gw_points} points</p>
                  </div>
                )
              })}
            </>
          }
        </div>
      </div>
      <div className='top-players-container'>
        <h4>Total Points Leader</h4>
        <div className='players'>
          {mostTotalPoints.map(player => {
            const { name, total_points, team: { logo }, id } = player
            return (
              <div className='player-single' key={id}>
                <img className='logo' src={logo}></img>
                <p>{name}</p>
                <p>{total_points} points</p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
  ```

### Styling
The main focus of styling was achieving a responsive app. The mobile version was a necessity for this app because users of fantasy football usually play the game using their phones. Therefore, I made media queries for 1440px, 1200px, 992px, 768px, 576px, 375px, and necessary view widths/heights in between. This responsive view covered most of the devices to be viewed comfortably by the user.

## Challenges
- The first challenge I have faced was creating the right back-end data models in order for the app to operate as a fantasy football game. Although data implementation was manual, I have found the most fundamental model that will enable the application to function properly. I will try to improve this in the future by automating the back-end database using the models I have planned in the diagram above.
- The biggest challenge for me was getting the Team Selection page exactly how I wanted with all of the conditionals that fit the rules of a fantasy football game. Setting up the nested conditionals at the right place was very important to make all of the conditions function properly. Although code was continuously updated throughout the whole process, I managed to make the functionality work within the back-end. I have learned that the positions of nested conditionals can lead to varied results. Therefore, it would be best to organise the levels of the conditionals in a piece of paper and think throughout the process thoroughly before implementing into the code. This may also lead to errors, but I think it would allow us to easily go back and modify them.
- Media queries were quite complicated to tackle as the football field within the Team Selection modal, My Teams, and Rankings modal were all different. Finding the right size image would be best in the future to have less amount of code that is input for responsive view.

## Wins and Takeaways
### Wins
- Creating the right functionality for the Team Selection page to function with all of the fantasy football rules was the biggest win as mentioned above.
- As I did not have a chance to work on responsive view in the other projects, I am happy to say that this application is user-friendly in various views.

### Takeaways
- The biggest takeaway from this project was that I was able to start on a project that I have always wanted to work on after deciding to change my career path as a software engineer. 
- I also learned how to plan out a long-term project, setting priorities and creating a demo version of the application. As I will continue to work on this app, I believe that more learning is waiting for me in the future.

## Future Improvements
- I would like to improve some of my code to be cleaner in some parts (such as the style sheets and the conditional within the info populated serializer). 
- Also, I will try to automate the data within the database, so that few events of each match will affect the players points.
- For the team selection page, I want to make it so that when the user stops selecting players and moves out of the browser, the user is directed to the team selection page for their next login and that the players are not saved so that the points are not updated for that user.
- I will continue working on this application in the future, adding elements such as transfers, chips, and more along the way which will almost exactly be similar to how a fantasy football game works.
