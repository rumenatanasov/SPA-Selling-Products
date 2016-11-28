function listAds() {
    $('#ads').empty();
    showView('viewAds');
    $.ajax({
        method: "GET",
        url: kinveyBaseUrl + "appdata/" + kinveyAppKey + "/advert",
        headers: getKinveyUserAuthHeaders(),
        success: loadAdsSuccess,
        error: handleAjaxError
    });

    function loadAdsSuccess(ads) {
        showInfo('Adverts loaded.');
        if (ads.length == 0) {
            $('#ads').text('No ads in the library.');
        } else {
            let adsTable = $('<table>')
                .append($('<tr>').append(
                    '<th>Title</th><th>Description</th>',
                    '<th>Publisher</th><th>Date Published</th>',
                    '<th>Price</th><th>Actions</th>'));
            for (let ad of ads)
                appendAdRow(ad, adsTable);
            $('#ads').append(adsTable);
        }
    }

    function appendAdRow(ad, adsTable) {
        let detailLink = $('<a href="#">[Read More]</a>')
            .click(function () {
                displayAdvert(ad)
            });
        let links = [detailLink];
        if (ad._acl.creator == sessionStorage['userId']) {
            let deleteLink = $('<a href="#">[Delete]</a>')
                .click(function () {
                    deleteAd(ad)
                });
            let editLink = $('<a href="#">[Edit]</a>')
                .click(function () {
                    loadAdForEdit(ad)
                });
            links = [detailLink, ' ' ,deleteLink, ' ', editLink];
        }


            adsTable.append($('<tr>').append(
                $('<td>').text(ad.title),
                $('<td>').text(ad.description),
                $('<td>').text(ad.publisher),
                $('<td>').text(ad.date),
                $('<td>').text(ad.price),
                $('<td>').append(links)
            ));
        }
    }

    function editAd(event) {
        event.preventDefault()
        let adData = {
            title: $('#formEditAd input[name=title]').val(),
            description: $('#formEditAd textarea[name=description]').val(),
            publisher: sessionStorage.getItem('username'),
            date: $('#formEditAd input[name=datePublished]').val(),
            price: Math.round($('#formEditAd input[name=price]').val() * 100) / 100,
            image: $('#formEditAd input[name=image]').val()
        };
        $.ajax({
            method: "PUT",
            url: kinveyBaseUrl + "appdata/" + kinveyAppKey + "/advert/" + $('#formEditAd input[name=id]').val(),
            headers: getKinveyUserAuthHeaders(),
            data: adData,
            success: editAdSuccess,
            error: handleAjaxError
        });

        function editAdSuccess(response) {
            listAds();
            showInfo('Advert edited.');
        }
    }

    function createAd(event) {
        event.preventDefault()
        let adData = {
            title: $('#formCreateAd input[name=title]').val(),
            description: $('#formCreateAd textarea[name=description]').val(),
            publisher: sessionStorage.getItem('username'),
            date: $('#formCreateAd input[name=datePublished]').val(),
            price: Math.round($('#formCreateAd input[name=price]').val() * 100) / 100,
            image: $('#formCreateAd input[name=image]').val()
        };
        $.ajax({
            method: "POST",
            url: kinveyBaseUrl + "appdata/" + kinveyAppKey + "/advert",
            headers: getKinveyUserAuthHeaders(),
            data: adData,
            success: createAdSuccess,
            error: handleAjaxError
        });

        function createAdSuccess(response) {
            listAds();
            showInfo('Advert created.');
        }
    }


    function deleteAd(ad) {
        $.ajax({
            method: "DELETE",
            url: kinveyBaseUrl + "appdata/" + kinveyAppKey + "/advert/" + ad._id,
            headers: getKinveyUserAuthHeaders(),
            success: deleteAdSuccess,
            error: handleAjaxError
        });
        function deleteAdSuccess(response) {
            listAds();
            showInfo('Advert deleted.');
        }
    }

    function loadAdForEdit(ad) {

        let req = {
            method: "GET",
            url: kinveyBaseUrl + "appdata/" + kinveyAppKey + "/advert/" + ad._id,
            headers: getKinveyUserAuthHeaders()
        };

        $.ajax(req)
            .then(loadAdForEditSuccess)
            .catch(handleAjaxError);

        function loadAdForEditSuccess(ad) {
            $('#formEditAd input[name=id]').val(ad._id);
            $('#formEditAd input[name=title]').val(ad.title);
            $('#formEditAd textarea[name=description]').val(ad.description);
            $('#formEditAd input[name=datePublished]').val(ad.date);
            $('#formEditAd input[name=price]').val(ad.price);
            $('#formEditAd input[name=image]').val(ad.image);
            showView('viewEditAd');
        }
    }

    function displayAdvert(advertID) {
        let req = {
            method: "GET",
            url: kinveyBaseUrl + "appdata/" + kinveyAppKey + "/advert/" + advertID._id,
            headers: getKinveyUserAuthHeaders()
        };

        $.ajax(req)
            .then(displayAdvertSuccess)
            .catch(handleAjaxError);
        $('#viewDetailsAd').empty();

        function displayAdvertSuccess(advert) {
            let html = $('<div>')
            html.append(
                $('<img>').attr('src', advert.image),
                $('<br>'),
                $('<label>').text('Price:'),
                $('<h1>').text(advert.price),
                $('<label>').text('Title:'),
                $('<h1>').text(advert.title),
                $('<label>').text('Description:'),
                $('<p>').text(advert.description),
                $('<label>').text('Publisher:'),
                $('<h1>').text(advert.publisher),
                $('<label>').text('Date:'),
                $('<h1>').text(advert.date)
            )
            html.appendTo($('#viewDetailsAd'))
            showView('viewDetailsAd');
        }


    }


