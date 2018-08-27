<template>
    <div>
        <!--Хедер тайла-->
        <!--TODO: хедер надо вынести в общий компонент-->
        <div class="dc-widget-grid__item__header">
            <div class="dc-widget-grid__item__header__captions">
                <h5>{{title}}</h5>
            </div>

            <div class="dc-widget-grid__item__header__right-column">

                <div class="dc-widget-grid__item__header__buttons">

                    <el-tooltip class="item" effect="dark" content="Раскрыть на весь экран" placement="bottom">
                        <el-button size="mini" class="dc-button-icon-small">
                            <img src="../../assets/img/icon-zoomin-small-white.svg" alt="">
                        </el-button>
                    </el-tooltip>

                    <el-tooltip class="item" effect="dark" content="Меню операций" placement="bottom">
                        <el-button size="mini" class="dc-button-icon-small">
                            <img src="../../assets/img/icon-burger-small-white.svg" alt="">
                        </el-button>
                    </el-tooltip>
                </div>
            </div>
        </div>
        <!--/Хедер тайла-->


        <el-form
                label-position="top"
                label-width="100px"
                :model="actionForm"
                class="dc-alert-passport__form">

            <el-collapse v-model="actionForm.activeTab">
                <el-collapse-item title="Основные" name="1">
                    <el-form-item label="Название:">
                        <el-input v-model="actionForm.name"></el-input>
                    </el-form-item>

                    <el-form-item label="Описание:">
                        <el-input
                                v-model="actionForm.description"
                                type="textarea"
                                :autosize="{ minRows: 2, maxRows: 6}">
                        </el-input>
                    </el-form-item>
                </el-collapse-item>

                <el-collapse-item title="Оповещение" name="2">
                    <div class="flex-parent flex-parent--wrap mb12">
                        <div v-for="(email, index) in actionForm.notification.emails"
                             class="dc-alert-passport__form__field flex-parent flex-parent--center-cross">
                            <el-form-item class="flex-child--grow" label="e-mail:">
                                <el-input v-model="email.address" placeholder="Новый e-mail..."></el-input>
                            </el-form-item>

                            <el-button type="text" class="dc-alert-passport__form__delete-field"
                                       v-on:click="removeEmail(index)">
                            </el-button>
                        </div>

                        <div class="dc-alert-passport__form__field flex-parent flex-parent--center-cross">
                            <el-button type="text"
                                       @click="addEmail()"
                                       class="dc-alert-passport__form__add-field"
                                       title="Добавить e-mail"></el-button>
                        </div>
                    </div>

                    <el-form-item label="Текст оповещения:">
                        <el-input
                                v-model="actionForm.notification.message"
                                type="textarea"
                                :autosize="{ minRows: 2, maxRows: 6}">
                        </el-input>
                    </el-form-item>

                </el-collapse-item>


                <el-collapse-item title="При ответе" name="3">
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <div class="my12 txt-h5 color-blue-dark">Варианты ответа:</div>
                            <el-radio-group v-model="actionForm.answer" class="dc-radio-group-block">
                                <el-radio :label="0">задача выполнена</el-radio>
                                <el-radio :label="1">что-то еще</el-radio>
                                <el-radio :label="2">что-то третье</el-radio>
                            </el-radio-group>
                        </el-col>
                        <el-col :span="12">
                            <div class="my12 txt-h5 color-blue-dark">Действие:</div>

                            <el-select v-model="actionForm.actionType">
                                <el-option label="завершить алерт" value="завершить алерт"></el-option>
                                <el-option label="приостановить алерт" value="приостановить алерт"></el-option>
                                <el-option label="сделать бочку" value="сделать бочку"></el-option>
                            </el-select>
                        </el-col>
                    </el-row>


                </el-collapse-item>
            </el-collapse>


        </el-form>

        <div class="dc-alert-passport__action__buttons flex-parent flex-parent--space-between-main">
            <button class="dc-alert-passport__action-tabs__button dc-alert-passport__action-tabs__button--save mb0">
                Сохранить
            </button>
            <button class="dc-alert-passport__action-tabs__button dc-alert-passport__action-tabs__button--close mb0">
                Выйти без сохранения
            </button>
        </div>

    </div>
</template>

<script>
    export default {
        name: "alert-passport-edit-form",
        props: {
            title: {
                type: String
            }
        },
        data() {
            return {
                actionForm: {
                    editEnabled: true,
                    activeTab: ['1', '2', '3'],
                    name: 'Мойка стекол',
                    description: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis. nisl ut aliquip ex ea commodo consequat.',

                    notification: {
                        emails: [
                            {address: 'someone@nowhere.com'},
                            {address: 'enybody@now'},
                            {address: 'this@that.is'},
                        ],
                        message: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis. nisl ut aliquip ex ea commodo consequat.',
                    },
                    answer: 0,
                    actionType: "завершить алерт"

                }
            }
        },
        methods: {
            addEmail: function () {
                this.actionForm.notification.emails.push({
                    address: ''
                })
            },
            removeEmail: function (index) {
                this.actionForm.notification.emails.splice(index, 1);
            }
        }
    }
</script>

<style lang="scss">
    .dc-alert-passport__form {
        padding: 10px;
    }

    .dc-radio-group-block .el-radio {
        display: block;
        margin: 0 0 10px 0;
    }

    .dc-alert-passport__form__field {
        min-width: 47%;
        margin-right: 3%;
    }

    .dc-alert-passport__form__delete-field {
        $size: 18px;
        margin: 8px 0 0 5px;
        width: $size;
        height: $size;
        background: url('../../assets/img/icon-minus-round-blue.svg') no-repeat center;
    }

    .dc-alert-passport__form__add-field {
        $size: 42px;
        width: $size;
        height: $size;
        background: url('../../assets/img/icon-plus-round-blue.svg') no-repeat center;
        background-size: cover;
        opacity: 0.65;

        &:hover {
            opacity: 1;
        }
    }
</style>