<script>
    import Vue from 'vue'
    import moment from 'moment';

    moment.locale('ru');

    // Кастомный фильтр форматирования дат
    Vue.filter('formatDateTime', function (dateTime, format) {
        return moment(dateTime).format(format);
    });

    // Даты относительно сегодня
    Vue.filter('formatRelativeDate', function (dateTime) {
        let date = moment(dateTime);

        let yesterday = moment(new Date()).add(-1, 'days');
        let today = moment(new Date());
        let tomorrow = moment(new Date()).add(1, 'days');

        if (date.isSame(yesterday, 'day')) {
            return 'вчера'
        }
        else if (date.isSame(today, 'day')) {
            return 'сегодня'
        }
        else if (date.isSame(tomorrow, 'day')) {
            return 'сегодня'
        }
        else {
            date.format('DD.MM.YYYY')
        }
    });
</script>

