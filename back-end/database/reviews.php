<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../CSS/style.css">
    <title>reviews</title>
</head>
<body>
<div id="reviews-section">
    <h2>Reviews</h2>
    <form id="review-form">
        <input type="text" name="name" placeholder="Your Name" required>
        <textarea name="content" placeholder="Your Review" required></textarea>
        <select name="rating" required>
            <option value="">Select Rating</option>
            <option value="1">1 Star</option>
            <option value="2">2 Stars</option>
            <option value="3">3 Stars</option>
            <option value="4">4 Stars</option>
            <option value="5">5 Stars</option>
        </select>
        <button type="submit">Submit Review</button>
    </form>

    <!-- Reviews Container -->
    <div id="reviews-container"></div>
</div>

<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script>
$(document).ready(function() {
    function loadReviews() {
        $.get('get-review.php', function(data) {
            $('#reviews-container').html(data);
        });
    }

    loadReviews();

    $('#review-form').submit(function(e) {
        e.preventDefault();
        $.post('save-review.php', $(this).serialize(), function(response) {
            if (response.status === 'success') {
                alert('Review submitted successfully!');
                $('#review-form')[0].reset();
                loadReviews();
            } else {
                alert('Error submitting review. Please try again.');
            }
        }, 'json');
    });
});
</body>
</html>