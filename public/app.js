$(document).ready(function ()
{
    $('#exampleModal').on('shown.bs.modal', function () {
        $('#myInput').trigger('focus')
      })
    function initPage()
    {
        // Run an AJAX request for any articles
        $.getJSON("/articles").then(function (data)
        {
           //articleContainer.empty();
            if (data.length > 0)
            {
                renderArticles(data);
            } else
            {
                renderEmpty();
            }
        });
       
    }
    initPage();
});

function renderArticles(articles) {

    var articleCards = [];
 
    for (var i = 0; i < articles.length; i++) {
      articleCards.push(createCard(articles[i]));
    }
   
   $("#articleCards").append(articleCards);
  }

  function createCard(article) {
   
    var card = $("<div class='card'>");
    var cardHeader = $("<div class='card-header'>").append(
      $("<h3>").append(
        $("<a class='article-link' target='_blank' rel='noopener noreferrer'>")
          .attr("href", article.link)
          .text(article.title),
        $("<button type='button' class='btn btn-success add-note' data-toggle='modal' data-target='#exampleModal'>Add Note</button>")
      )
    );

    var cardBody = $("<div class='card-body'>").text(article.summary);

    card.append(cardHeader, cardBody);

    card.data("_id", article._id);
    
    return card;
  }

    // Grab the articles as a json
    $.getJSON("/articles", function (data)
    {
        // For each one
        for (var i = 0; i < data.length; i++)
        {
            // Display the apropos information on the page
            $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].summary + "<br />" + data[i].link + "</p>");
        }
    });

    //Button action to scrape new articles
    $(".scrape-new").on("click", function ()
    {
        $.ajax({
            method: "GET",
            url: "/scrape"
        })
            .then(function (data)
            {
                location.reload(true);
                alert(data);
            })
    });

    $(".clear").on("click", function ()
    {
        $.ajax({
            method: "POST",
            url: "/clear"
        })
            .then(function (data)
            {
                alert(data);
                location.reload(true);
            })
    });

    // Whenever someone clicks the add note button
    $(document).on("click", ".add-note", function ()
    {
        
        // Empty the notes from the note section
        $("#notes").empty();
        
        var thisId = $(this).parents(".card").data()._id;
        console.log(thisId + "this")

        // Now make an ajax call for the Article
        $.ajax({
            method: "GET",
            url: "/articles/" + thisId
        })
            // With that done, add the note information to the page
            .then(function (data)
            {
                console.log(data.title);
                // The title of the article
                $(".modal-title").text(data.title);
                // An input to enter a new title
                $("#notes").append("<input id='titleinput' name='title' >");
                // A textarea to add a new note body
                $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
                // A button to submit a new note, with the id of the article saved to it
                $("#savenote").attr("data-id", data._id);

                // If there's a note in the article
                if (data.note)
                {
                    // Place the title of the note in the title input
                    $("#titleinput").val(data.note.title);
                    // Place the body of the note in the body textarea
                    $("#bodyinput").val(data.note.body);
                }
            });
    });

    // When you click the savenote button
    $(document).on("click", "#savenote", function ()
    {
        // Grab the id associated with the article from the submit button
        var thisId = $(this).attr("data-id");

        // Run a POST request to change the note, using what's entered in the inputs
        $.ajax({
            method: "POST",
            url: "/articles/" + thisId,
            data: {
                // Value taken from title input
                title: $("#titleinput").val(),
                // Value taken from note textarea
                body: $("#bodyinput").val()
            }
        })
            // With that done
            .then(function (data)
            {
                // Log the response
                console.log(data);
                // Empty the notes section
                $("#notes").empty();
            });

        // Also, remove the values entered in the input and textarea for note entry
        $("#titleinput").val("");
        $("#bodyinput").val("");
    });

