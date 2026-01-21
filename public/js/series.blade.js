// Ensure jQuery is loaded before executing the script
if (typeof $ === 'undefined') {
    console.error('jQuery is not loaded. Ensure jQuery is included before this script.');
    alert('jQuery is required for this script to work. Please include jQuery in your HTML file.');
} else {
    $(document).ready(function() {
        $('#refresh-btn').click(function() {
            const selectedSeries = $('#select-se').val();
            $(this).addClass('fa-spin');
            setTimeout(() => {
                if (selectedSeries) {
                    showSeries(selectedSeries);
                } else {
                    $('#series-table').html('<p>Please select a policy series to refresh.</p>');
                }
                $(this).removeClass('fa-spin');
            }, 800);
        });
    });

    function showSeries(seriesId) {
        if (!seriesId) {
            $('#series-table').html('<p>Select a policy series to view details</p>');
            return;
        }
        $.ajax({
            url: `/series/api/getseries?id=${seriesId}`,
            type: "GET",
            success: function(response) {
                if (response.error) {
                    $('#series-table').html(`<p>${response.error}</p>`);
                } else {
                    let tableRows = '';
                    response.forEach(series => {
                        tableRows += `
                            <tr>
                                <td>${series.series}</td>
                                <td><img src="${series.image}" alt="Image" class="series-image"></td>
                                <td>${series.name}</td>
                                <td>${series.plate_no}</td>
                                <td>${series.walk_in}</td>
                                <td>${series.cost}</td>
                                <td><span class="badge badge-${series.policy_status.toLowerCase()}">${series.policy_status}</span></td>
                                <td><span class="badge badge-${series.detection.toLowerCase()}">${series.detection}</span></td>
                                <td>${series.date}</td>
                                <td><button class="btn btn-primary btn-sm">Verify</button></td>
                            </tr>
                        `;
                    });
                    $('#series-table').html(`
                        <table class="table table-bordered">
                            <thead>
                                <tr>
                                    <th>Series</th>
                                    <th>Image</th>
                                    <th>Name</th>
                                    <th>Plate No.</th>
                                    <th>Walk-In</th>
                                    <th>Cost</th>
                                    <th>Policy Status</th>
                                    <th>Detection</th>
                                    <th>Date</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>${tableRows}</tbody>
                        </table>
                    `);
                }
            },
            error: function(xhr) {
                const errorMessage = xhr.responseJSON?.error || 'Error loading series data.';
                $('#series-table').html(`<p>${errorMessage}</p>`);
            }
        });
    }
}
