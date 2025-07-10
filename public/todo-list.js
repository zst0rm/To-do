$(document).ready(function() {
     $('#todo-form').on('submit', function(e) {
        e.preventDefault(); // Stop page reload

        var title = $('#title').val();
        var description = $('#description').val();
        var date = $('#date').val();

        var todo = {
            title: title,
            description: description,
            completed: false,
            date: date
        };

        $.ajax({
            type: 'POST',
            url: '/todo',
            contentType: 'application/json',
            data: JSON.stringify(todo),
            success: function(response) {
                console.log('Added:', response);
                location.reload();
            },
            error: function(xhr) {
                console.error('Error:', xhr.responseText);
                alert('Failed to add task');
            }
        });
    });

    $('ul').on('click', '.delete-btn', function(e) {
        e.stopPropagation();

        var $taskCard = $(this).closest('.task-card');  // Grab the whole task card
        var itemId = $(this).data('id');  // Get the MongoDB ID

        $.ajax({
            type: 'DELETE',
            url: '/todo/' + itemId,
            success: function(data) {
                console.log('Deleted:', data);
                $taskCard.remove();  // Remove the card from the page instantly
                location.reload(); // Reload the page to reflect changes
            },
            error: function(xhr, status, error) {
                console.error('Delete failed:', xhr.responseText);
                alert('Failed to delete task');
            }
        });
    });




    $('ul').on('click', '.task-text', function() {
        var $li = $(this);
        var oldText = $li.text().trim();
        var itemId = oldText.replace(/ /g, "-");

        // Create an input element
        var $input = $('<input type="text" class="task-input">').val(oldText);
        $li.html($input);
        $input.focus();

        // When user presses Enter
        $input.on('keypress', function(e) {
            if (e.which === 13) { // Enter key
                var newText = $input.val().trim();
                if (newText && newText !== oldText) {
                    $.ajax({
                        type: 'PUT',
                        url: '/todo/' + itemId,
                        contentType: 'application/json',
                        data: JSON.stringify({ item: newText }),
                        success: function(data) {
                            console.log('Item updated:', data);
                            $li.text(newText); // Update UI with new text
                        },
                        error: function() {
                            alert('Error updating item');
                            $li.text(oldText); // Revert on error
                        }
                    });
                } else {
                    $li.text(oldText); // No change, revert
                }
            }
        });

        // When input loses focus (optional: also save or revert)
        $input.on('blur', function() {
            $li.text(oldText); // Just revert for now
        });
    });

});