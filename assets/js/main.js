$(() => {
    let accordion = $('#contentAccordion');
    let inputTitle = $('#inputTitle');
    let inputText = $('#inputText');
    let inputTextJustify = $('#inputTextJustify');
    let removeBtns = () => $('#contentAccordion .accordion-item .remove-button');
    let editBtns = () => $('#contentAccordion .accordion-item .edit-button');

    const TextJustify = Object.freeze({
        Left: "left",
        Right: "right",
        Center: "center",
        Justify: "justify"
    });

    let createEditFormTemplate = item => {
        return `
            <div class="modal fade" id="modalEditForm" tabindex="-1" aria-labelledby="modalEditFormLabel" aria-hidden="true">
                <div class="modal-dialog modal-xl">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="modalEditFormLabel">` + item.title + `</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div class="form-group mb-xs-5">
                                <label class="mb-xs-5" for="editInputTextJustify">Выравнивание текста</label>
                                <select class="form-control" id="editInputTextJustify">
                                    <option value="left">По левому краю</option>
                                    <option value="right">По правому краю</option>
                                    <option value="center">По центру</option>
                                    <option value="justify">По ширине</option>
                                </select>
                            </div>
                            <form id="editForm" class="form w-xs-100">
                                <div class="form-group">
                                    <label class="mb-xs-5" for="editInputText">Текст</label>
                                    <textarea class="form-control" id="editInputText" rows="10" placeholder="Введите текст блока"></textarea>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" id="editBtnClose" class="btn btn-secondary" data-bs-dismiss="modal">Закрыть</button>
                            <button type="button" id="editBtnApply" class="btn btn-primary">Изменить</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    let createItemTemplate = item => {
        return `
            <div class="accordion-item">
                <h2 class="accordion-header flex-row" id="heading` + item.id + `">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse` + item.id + `" aria-expanded="true" aria-controls="collapse` + item.id + `">
                        ` + item.title + `
                    </button>
                    <button type="button" class="accordion-button collapsed edit-button w-xs-auto" data-item-id="` + item.id + `" data-bs-toggle="collapse" data-bs-target="#collapse` + item.id + `" aria-expanded="true" aria-controls="collapse` + item.id + `">&#9998;</button>
                    <button type="button" class="accordion-button collapsed remove-button w-xs-auto" data-item-id="` + item.id + `" data-bs-toggle="collapse" data-bs-target="#collapse` + item.id + `" aria-expanded="true" aria-controls="collapse` + item.id + `">&#10006;</button>
                </h2>
                <div id="collapse` + item.id + `" class="accordion-collapse collapse" aria-labelledby="heading` + item.id + `" data-bs-parent="#contentAccordion">
                    <div class="accordion-body text-` + item.textJustify + ` text-wrap">
                        ` + item.text.replace(/\n/g, '<br/>') + `
                    </div>
                </div>
            </div>
        `;
    };

    let createItem = (title, text, textJustify = TextJustify.Left) => {
        return {
            title,
            text,
            textJustify,
            getTemplate: function() { return createItemTemplate(this) }
        };
    };

    let items = [
        createItem("Item 1", "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Repellat, hic.", TextJustify.Justify),
        createItem("Item 2", "Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima nostrum libero cupiditate dicta aperiam excepturi.", TextJustify.Justify),
        createItem("Item 3", "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Delectus quae velit ipsam ab cum asperiores, illum placeat reprehenderit et quisquam recusandae quas facere consequatur excepturi odio, mollitia doloremque vero? Dolor.", TextJustify.Justify),
        createItem("Item 4", "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Possimus, odit enim, temporibus excepturi quasi expedita ipsum ullam aspernatur fugit quae modi rerum obcaecati fuga quis, sed repellendus quisquam soluta veritatis! Consequuntur ducimus deserunt numquam molestiae reiciendis cupiditate corporis vero pariatur quas. Non officia deleniti velit labore! Harum libero autem vero quae incidunt, beatae sapiente odit commodi tempore at nisi ex! Distinctio quidem totam fugit modi quae ducimus magnam laborum molestiae.", TextJustify.Justify)
    ];

    let getItemById = id => {
        return items.filter(item => {
            return item.id == id;
        })[0];
    }

    let removeItemById = id => {
        let index = items.indexOf(getItemById(id));
        if (index !== -1) {
            items.splice(index, 1);
        }
    }

    let updateItemsIds = () => {
        items.forEach((item, i) => {
            item.id = i + 1;
        })
    };

    let updateAccordion = () => {
        accordion.empty();
        if (items.length !== 0) {
            items.forEach(item => {
                accordion.append(item.getTemplate());
            });
            removeBtns().on('click', e => {
                e.preventDefault();
                let btnElement = $(e.target);
                let itemId = btnElement.attr('data-item-id');
                removeItemById(itemId);
                updateItemsIds();
                updateAccordion();
            });
            editBtns().on('click', e => {
                e.preventDefault();
                let btnElement = $(e.target);
                let item = getItemById(btnElement.attr('data-item-id'));

                $('#modalEditForm').remove();
                $('.page').append(createEditFormTemplate(item));

                $('#editInputTextJustify').val(item.textJustify);
                $('#editInputText').val(item.text.replaceAll('<br/>', '\n'));

                let editForm = new bootstrap.Modal($('#modalEditForm'), {
                    focus: true
                });

                $('#editForm').on('submit', e => {
                    e.preventDefault();
                    item.text = $('#editInputText').val().replaceAll('<br/>', '\n');
                    item.textJustify = $('#editInputTextJustify').val();
                    editForm.hide();
                    updateAccordion();
                });

                $('#editBtnApply').on('click', e => {
                    $('#editForm').trigger('submit');
                });

                $('#modalEditForm').on('hidden.bs.modal', () => {
                    editForm.dispose();
                    $('#modalEditForm').remove();
                });

                editForm.show();
            });
        } else {
            accordion.append('<h1 class="items-empty-alert text-center">В списке нет элементов</h1>')
        }
    };

    let addItem = (title, text, textJustify = TextJustify.Left) => {
        items.push(createItem(title, text, textJustify));
    };

    let clearInputs = () => {
        inputTitle.val("");
        inputText.val("");
        inputTextJustify.val(TextJustify.Left);
    };

    $("#inputs").on('submit', e => {
        e.preventDefault();
        addItem(inputTitle.val(), inputText.val(), inputTextJustify.val());
        updateItemsIds();
        updateAccordion();
        clearInputs();
    });

    $("#inputsClr").on('click', clearInputs);

    updateItemsIds();
    updateAccordion();
});