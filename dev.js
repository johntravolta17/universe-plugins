$(document).ready(function() {
            $(".main-container").fadeIn();
            window.addEventListener("message", (event) => {
                var item = event.data;
                if (item !== undefined && item.type === "ui") {
                    if (item.display === true) {
                        $(".main-container").fadeIn();
                        $(document).on("keydown", function(e) {
                            if (e.which == 27) {
                                fetch(`https://${GetParentResourceName()}/closeUI`, {
                                        method: "POST",
                                        headers: {
                                            "Content-Type": "application/json; charset=UTF-8",
                                        },
                                        body: JSON.stringify({
                                            ui: false,
                                        }),
                                    })
                                    .then((resp) => resp.json())
                                    .then((resp) => console.log("Closing UI"));
                            }
                        });
                    } else if (item.display === false) {
                        $(".main-container").fadeOut();
                    }
                }
            });

            function sumArray(numberArray) {
                if (numberArray.length > 0) {
                    return numberArray
                        .map(function(elt) {
                            return /^\d+$/.test(elt) ? parseInt(elt) : 0;
                        })
                        .reduce(function(a, b) {
                            return a + b;
                        });
                } else {
                    return 0;
                }
            }

            function formatString(string) {
                return string.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            }

            function getCheckboxes() {
                let totalMultas = [];
                let totalAnos = [];
                let data = [];

                if ($("input[type=checkbox]:checked").length > 0) {
                    $("input[type=checkbox]:checked").each(function() {
                        totalMultas.push($(this).attr("multa"));
                        totalAnos.push($(this).attr("anos"));
                    });
                }

                data.push(sumArray(totalMultas));
                data.push(sumArray(totalAnos));

                return data;
            }

            function getCheckboxesStrings() {
                deptsSelected = "";
                length = $("td input[type=checkbox]:checked").length;

                if (length > 0) {
                    $("td input[type=checkbox]:checked").each(function(index) {
                        if (length <= index) {
                            deptsSelected += `   - ${$("label[for='" + this.id + "']").text()}`;
                        } else {
                            deptsSelected += `   - ${$("label[for='" + this.id + "']").text()}\n`;
                        }
                    });
                    return deptsSelected;
                } else {
                    return "";
                }
            }

            function getCheckboxesGuarnicoes() {
                deptsSelected = "";
                length = $(".form-check input[type=checkbox]:checked").length;

                if (length > 0) {
                    $(".form-check input[type=checkbox]:checked").each(function(index) {
                        if (length <= index) {
                            deptsSelected += `   - ${$(this).val()}`;
                        } else {
                            deptsSelected += `   - ${$(this).val()}\n`;
                        }
                    });
                    return deptsSelected;
                } else {
                    return "";
                }
            }

            function getPending() {
                currentVal = $("#multas-pendentes").val().replace(/,/g, "");
                pending = currentVal / 1000;
                newVal = $("#multas-pendentes").val(formatString(currentVal));
                return pending;
            }

            function formatInput(element) {
                currentVal = element.val().replace(/,/g, "");
                newVal = currentVal / 1000;
                if (Number.isNaN(newVal)) {
                    newVal = element.val("");
                } else {
                    newVal = element.val(formatString(currentVal));
                }
                return newVal;
            }

            function createQtyString(selector) {
                return $(`#qty-${selector}`).val() ?
                    `   - ${$(`#${selector}-label`).text()} x ${$(
          `#qty-${selector}`
        ).val()}`
      : "";
  }

  function getQtyStrings() {
    sujoData = createQtyString("sujo");
    drogaData = createQtyString("drogas");
    compData = createQtyString("aco");
    coleteData = createQtyString("colete");
    desacatoData = createQtyString("desacato");
    desobedienciaData = createQtyString("desobediencia");
    semaforoData = createQtyString("semaforo");
    muniData = createQtyString("muni");
    tHomiCivil = createQtyString("t-homicidio-civil");
    tHomiMilitar = createQtyString("t-homicidio-militar");
    HomiMilitar = createQtyString("homicidio-militar");
    brancaData = createQtyString("branca");

    return `${
      semaforoData ? `${semaforoData}\n` : ""
    }${sujoData ? `${sujoData}\n` : ""}${drogaData ? `${drogaData}\n` : ""}${acoData ? `${acoData}\n` : ""}${coleteData ? `${coleteData}\n` : ""}${brancaData ? `${brancaData}\n` : ""}${muniData ? `${muniData}\n` : ""}${desobedienciaData ? `${desobedienciaData}\n` : ""}${desacatoData ? `${desacatoData}\n` : ""}${tHomiCivil ? `${tHomiCivil}\n` : ""}${tHomiMilitar ? `${tHomiMilitar}\n` : ""}${HomiMilitar ? `${HomiMilitar}\n` : ""}`;
  }

  function setInputsData(tMultas, tAnos) {
    $("#total-multas").text("$ " + formatString(Math.round(tMultas)));

    $("#total-anos").text(Math.round(tAnos));
  }

  function getQty(selector, mUnit, aUnit) {
    inputVal = $(selector).val().replace(/,/g, "");
    multa = inputVal * mUnit;
    anos = inputVal * aUnit;

    return [multa, anos];
  }

  function sumAllInputs() {
    sujoData = getQty("#qty-sujo", 1, 1);
    brancaData = getQty("#qty-branca", 5000, 0 );
    drogaData = getQty("#qty-drogas", 1, 0.3333333);
    compData = getQty("#qty-aco", 1, 0.5);
    coleteData = getQty("#qty-colete", 1, 0.5);
    muniData = getQty("#qty-muni", 1, 0.3333333);
    tHomiCivil = getQty("#qty-t-homicidio-civil", 30000, 30);
    homiMilitar = getQty("#qty-homicidio-militar", 60000, 60);
    semaforo = getQty("#qty-semaforo", 5000, 0);
    desacato = getQty("#qty-desacato", 20000, 15);
    desobediencia = getQty("#qty-desobediencia", 20000, 15);
    pending = getPending();
    checkboxes = getCheckboxes();

    if (sujoData[1] > 0) {
      sujoData[0] = 10000;
    }

    if (drogaData[1] > 0) {
      drogaData[0] = 20000;
    }

    if (acoData[1] > 0) {
      acoData[0] = 20000;
    }

    if (coleteData[1] > 0) {
      coleteData[0] = 20000;
    }

    if (muniData[1] > 0) {
      muniData[0] = 20000;
    }

    totalMultas =
      sujoData[0] +
      drogaData[0] +
      acoData[0] +
      coleteData[0] +
      brancaData[0] +
      muniData[0] +
      checkboxes[0] +
      tHomiCivil[0] +
      homiMilitar[0] +
      semaforo[0] +
      desacato[0] +
      desobediencia[0];

    totalAnos =
      sujoData[1] +
      drogaData[1] +
      acoData[1] +
      brancaData[1] +
      coleteData[1] +
      muniData[1] +
      pending +
      checkboxes[1] +
      tHomiCivil[1] +
      homiMilitar[1] +
      semaforo[1] +
      desacato[1] +
      desobediencia[1];

    if (totalMultas > 600000) {
      totalMultas = 600000;
    }

    if (totalAnos > 500) {
      totalAnos = 500;
    }

    if ($("#primario").is(":checked")) {
      totalAnos = totalAnos / 2;
    }

    setInputsData(totalMultas, totalAnos);
  }

  $(".clean").click(function () {
    $("input[type=checkbox]:checked").prop("checked", false);
    $("#total-multas").text("$ 0");
    $("#total-anos").text("0");
    $("#multas-pendentes").val("");
    $("#qty-sujo").val("");
    $("#qty-branca").val("");
    $("#qty-drogas").val("");
    $("#qty-aco").val("");
    $("#qty-colete").val("");
    $("#qty-muni").val("");
    $("#qty-homicidio-militar").val("");
    $("#qty-t-homicidio-civil").val("");
    $("#qty-t-homicidio-militar").val("");
    $("#qty-semaforo").val("");
    $("#qty-desobediencia").val("");
    $("#qty-desacato").val("");
    $("#nome").val("");
    $("#idade").val("");
    $("#id").val("");
    $("#pass").val("");
  });

  $(".cred-close").click(function () {
    $(".credits").fadeOut();
  });

  $(".obs-close").click(function () {
    $(".obs-container").fadeOut();
  });

  $(".ficha-close").click(function () {
    $(".ficha-copy").fadeOut();
  });

  $(".logo").click(function () {
    $(".credits").fadeIn();
  });

  $(".ficha-form-close").click(function () {
    $(".ficha-container").fadeOut();
  });

  $(".fc").click(function () {
    $(".ficha-container").fadeIn();
    $("#ficha-tempo").val(`${$("#total-anos").text()} Meses`);
    $("#ficha-multa").val($("#total-multas").text());
    $("#ficha-pendentes").val(
      `$ ${$("#multas-pendentes").val() ? $("#multas-pendentes").val() : 0}`
    );
    $("#motivo").val(getCheckboxesStrings() + getQtyStrings());
  });

  $("#btn-ficha").click(function () {
    nome = $("#nome").val();
    nomeStr = `:notepad_spiral: Nome: ${nome}`;
    idade = $("#idade").val();
    idadeStr = `:calendar: Idade: ${idade}`;
    passaporte = $("#pass").val();
    passaporteStr = `:id: Passaporte: ${passaporte}`;
    rg = $("#id").val();
    rgStr = `:passport_control: RG: ${rg}`;
    motivos = `:scales: Motivo:\n${$("#motivo").val()}`;
    tempo = `:alarm_clock: Tempo De Pena: ${$("#ficha-tempo").val()}`;
    multa = `:dollar: Multa: R${$("#ficha-multa").val()}`;
    guarnicao = getCheckboxesGuarnicoes();
    guarnicaoStr = `:shield:  Guarnição:\n${guarnicao}`;
    pendientes = `:ticket: Multas Pendentes: R$${
      $("#multas-pendentes").val() ? $("#multas-pendentes").val() : 0
    } (+ ${Math.round(getPending())} Meses)`;

    if ($("#primario").is(":checked")) {
      tempo = tempo + ` (Reu primario)`;
    }

    emptyInputCheck =
      nome == "" || idade == "" || passaporte == "" || rg == "" ? true : false;

    $("#g-error").fadeOut();
    $("#i-error").fadeOut();

    if (guarnicao == "" || emptyInputCheck) {
      if (guarnicao == "") {
        $("#g-error").fadeIn();
      }
      if (emptyInputCheck) {
        $("#i-error").fadeIn();
      }
    } else {
      $("#g-error").fadeOut();
      $("#i-error").fadeOut();
      $("#ficha-copy").text(
        `${nomeStr}\n${idadeStr}\n${passaporteStr}\n${rgStr}\n${motivos}${pendientes}\n${tempo}\n${multa}\n${guarnicaoStr}`
      );
      $(".ficha-container").fadeOut();
      $(".ficha-copy").fadeIn();
    }
  });

  $(".info").click(function () {
    $(".obs-container").fadeIn();
  });

  $("input:checkbox").change(function () {
    sumAllInputs();
  });

  $("#pass, #idade").on("input", function () {
    formatInput($(this));
  });

  $(
    "#qty-sujo, #qty-drogas, #qty-aco, #qty-colete, #qty-tartarugas, #qty-muni, #multas-pendentes, #qty-homicidio-militar, #qty-t-homicidio-civil, #qty-t-homicidio-militar, #qty-semaforo, #qty-desobediencia, #qty-desacato"
  ).on("input", function () {
    formatInput($(this));
    sumAllInputs();
  });
});