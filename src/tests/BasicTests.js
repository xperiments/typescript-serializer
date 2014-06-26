/**
* BasicTests.ts
* Created by xperiments on 25/06/14.
*/
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Serializer = io.xperiments.utils.serialize.Serializer;
var Serialized = io.xperiments.utils.serialize.Serializable;

var BasicTestModel = (function (_super) {
    __extends(BasicTestModel, _super);
    function BasicTestModel() {
        _super.apply(this, arguments);
        this.arrayOfStrings = [];
        this.arrayOfNumbers = [];
        this.arrayOfBooleans = [];
        /* custom */
        /* custom */
        this.childModel = new BasicChildTestModel();
        this.childModelArray = [];
    }
    return BasicTestModel;
})(Serialized);

var BasicTestModelSerializer = (function () {
    function BasicTestModelSerializer() {
        this["@serializer"] = null;
        this.string = null;
        this.number = null;
        this.boolean = null;
        this.arrayOfStrings = null;
        this.arrayOfNumbers = null;
        this.arrayOfBooleans = null;
        this.childModel = null;
        this.childModelArray = null;
    }
    return BasicTestModelSerializer;
})();

var BasicChildTestModel = (function (_super) {
    __extends(BasicChildTestModel, _super);
    function BasicChildTestModel() {
        _super.apply(this, arguments);
        this.string = "hello";
        this.number = 777;
        this.boolean = true;
        this.arrayOfStrings = ["o", "p", "k"];
        this.arrayOfNumbers = [222, 333, 444];
        this.arrayOfBooleans = [true, false, true];
    }
    return BasicChildTestModel;
})(Serialized);

var BasicChildTestModelSerializer = (function () {
    function BasicChildTestModelSerializer() {
        this["@serializer"] = null;
        this.string = null;
        this.number = null;
        this.boolean = null;
        this.arrayOfStrings = null;
        this.arrayOfNumbers = null;
        this.arrayOfBooleans = null;
    }
    return BasicChildTestModelSerializer;
})();

var CustomSerializerModel = (function (_super) {
    __extends(CustomSerializerModel, _super);
    function CustomSerializerModel() {
        _super.apply(this, arguments);
        this.date = new Date();
    }
    return CustomSerializerModel;
})(Serialized);

var CustomSerializerSerializer = (function () {
    function CustomSerializerSerializer() {
        this["@serializer"] = null;
        this.date = new Date();
    }
    CustomSerializerSerializer.prototype.set_date = function (date) {
        return [date.getFullYear(), date.getMonth() + 1, date.getDate()].join('/');
    };
    CustomSerializerSerializer.prototype.get_date = function (dateString) {
        var dateParts = dateString.split('/');
        var date = new Date();
        date.setFullYear(parseInt(dateParts[0], 10));
        date.setMonth(parseInt(dateParts[1], 10) - 1);
        date.setDate(parseInt(dateParts[2], 10));
        return date;
    };
    return CustomSerializerSerializer;
})();
var CustomImageModel = (function (_super) {
    __extends(CustomImageModel, _super);
    function CustomImageModel() {
        _super.apply(this, arguments);
    }
    return CustomImageModel;
})(Serialized);

var CustomImageModelSerializer = (function () {
    function CustomImageModelSerializer() {
        this["@serializer"] = null;
        this.image = null;
    }
    CustomImageModelSerializer.prototype.set_image = function (image) {
        var canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;
        canvas.getContext('2d').drawImage(image, 0, 0);
        return canvas.toDataURL();
    };
    CustomImageModelSerializer.prototype.get_image = function (image64) {
        var img = document.createElement('img');
        img.src = image64;
        return img;
    };
    return CustomImageModelSerializer;
})();

Serializer.registerClass(function () {
    return BasicTestModel;
}, BasicTestModelSerializer);
Serializer.registerClass(function () {
    return BasicChildTestModel;
}, BasicChildTestModelSerializer);
Serializer.registerClass(function () {
    return CustomSerializerModel;
}, CustomSerializerSerializer);
Serializer.registerClass(function () {
    return CustomImageModel;
}, CustomImageModelSerializer);

test("Cloning Simple Types [string,number,boolean,string[],number[],boolean[],Object,Object[]", function () {
    // Arrange
    var testModel = new BasicTestModel();
    testModel.string = "str";
    testModel.number = 666;
    testModel.boolean = false;
    testModel.arrayOfStrings = ["a", "b", "c"];
    testModel.arrayOfNumbers = [0, 1, 2];
    testModel.arrayOfBooleans = [false, true, false];

    testModel.childModel = new BasicChildTestModel();
    testModel.childModel.string = "Hello World!!!!";
    for (var i = 0; i < 10; i++) {
        var c = new BasicChildTestModel();
        c.number = ~~Math.random() * 1000;
        testModel.childModelArray.push(c);
    }

    var copyModel = new BasicTestModel();
    copyModel.readObject(testModel.writeObject());

    // Act
    // Assert
    equal(JSON.stringify(testModel.writeObject()), JSON.stringify(copyModel.writeObject()));
});

test("Cloning with Custom Serializer methods [ Date YYYY/MM/DD ]", function () {
    // Arrange
    var testModel = new CustomSerializerModel();
    var copyModel = new CustomSerializerModel();
    copyModel.readObject(testModel.writeObject());

    console.log(copyModel.stringify(true));
    equal(JSON.stringify(testModel.writeObject()), JSON.stringify(copyModel.writeObject()));
});

asyncTest("Cloning custom Image", function () {
    expect(1);

    // Arrange
    var testModel = new CustomImageModel();
    testModel.image = document.createElement('img');
    testModel.image.addEventListener('load', function () {
        var copyModel = new CustomImageModel();
        copyModel.readObject(testModel.writeObject());

        console.dir(copyModel);
        ok(JSON.stringify(testModel.writeObject()) == JSON.stringify(copyModel.writeObject()), "Passed Cloning custom Image");
        QUnit.start();
        document.body.appendChild(copyModel.image);
    });
    testModel.image.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQMAAADyCAYAAABJaKDDAAA+JklEQVR4XuzUQQ0AIBADsB3Bv+UhgtclrYhO2wCcfAJkAMgAkAEgA0AGgAwAGQAyAGQAyACQASADgJvVeOydB5RU1RnHvzezFZQqWFBEKSpiiwlig2gwRKMxYDTGgIqKMaDGAuJRwEoQC8eSYMDYAKNRsBBJEEMMYC+oFA2IgKiAVKXtsrszN/O7x7tnGN6bsjvlvd37P+edtzs7O/PezL3/+33/r9zKykq1bds2+frrr2X58uXy1Vdfyfr16/ldn7/99lvZuHGjbN26VXheRUWFVFdXCyguLpby8nLZY489ZM8995TWrVtLixYtpE2bNtKuXTt93n///eXggw/md/28srIyRxokLAJWwmyxcuVK9c4778iaNWtk7dq18sknn8iyZcv4GWIQvk+OaDTKufZIB47j1B6hUMj8DAHIPvvsI506dZKuXbvqn/fdd1857rjjpEOHDnkgBwtLBhZMevX222/L0qVLIQJ599139eSPRCK7HPlAOBze5YAcunfvDiFIly5dpEePHpBEtsjBwpKBxf/+9z+9+n/++efywQcfyKJFi2Tz5s3avK+qqhI3lJSUSLdu3eTQQw9lcmLWmxVdn/faay/MfHOOdzOwKmrPNTU1uBr6/MUXX/Az78/Be7u+L+5Gy5Yt9fsfe+yx0rFjR6wGriVDYrCwZGDBxFOvv/66LFmyRN566y359NNPZcuWLUzS3VZ+VuGTTjpJjjzySDP59VFUVJRrF4UDYtDuCRbLggULdrEcIJ5mzZrJYYcdJscff7wccsgh+loPPPDAZMRgYcnAIkYA2g2YP3++vPfee/LNN98g8mmf36Bz587Sq1cv6dmzJ2e92vsFCJRz5syRuXPnyiuvvCKfffaZADQHxMm9995bfvSjH8kPfvAD3AiIwRENC0sGFqj66h//+If2/WfPni2LFy/mMcxwM5H0xP/Vr34lP/3pT7XJHxRAZv/85z/lxRdfhCC4J1wJ7Zocfvjh8pOf/ERrDWeddRaPNU5isGRgsW7dOvXaa69p83rWrFn46KystQRw8sknyznnnCNnnnmmDvMFHdu3bxdI729/+5vMmzcPa4fQJZYNJKcthVNOOUXatm3bKEjBkoEF8X7F5P/www/l3//+N/kAeqIAJsaFF14oAwYMkP32268hE6E8/fTT8thjj2lRsmnTpjp/oXfv3nLMMcdADuQ1NFxSsGRgE4JYGRcuXIjpjD+t3QFAvH7YsGFMAi38NRYQpYAYJ06ciFCKq6A1kTPOOEOOOOII3IeGldhkycAiFhpUWAH4zoQIv/vuOwGo7Ndff7387Gc/k8aON998U8aNG6fdpubNm+uQ5C9/+UusBUKTwSYESwYWX375pXYJXn31VUEf2LBhQy0JXHPNNdKnTx/ZDTaiIqNHjyacSh6E1hFOO+00bTUdcMABgSMFSwYW6AHqP//5j0ybNo1IAQ8xmGXIkCE6MpAcFlhRDzzwAIRKxEGLqaeeeiqWQiAIwZKBBanCOkowc+ZMgQzQBcjKGzx4sFxyySVSWloq6cGCBCv0hPHjx/O5QQa4VFgLJFv5lxQsGVj897//NdYAacS1GYL33nuvVsvrBotVq1bhVkG0ZFnWWgk//vGP/UcIlgxszgAJQzNmzJB//etfJl9AuwPXXXedNGnSROoHi507d8o999wjU6dO1fkJp59+uvz85z8ncckXuQmWDCzIE1DPP/+8vPDCC1QRkkyj4+YjRozQSngK4ELwfMxgwmiceYwQI8lHvB4hOAqTmBCEKDmTm8BjjdH6kltvvZU0bV0l2bdvX+nXrx+WV+EIwZKBxfvvv69zB5588kktdIGDDjpI7r77bhqBJCMAwmeQAGdIoC55C4QoIQXOjYoY6N9ASHbFihValL3ooot0TsIPf/jDvBKCJQMLKgi1NvDyyy9jturOQYDKvNtuu00X5STCNAbBxCVkRjehbIH3J2yJe2KamjR0YBncfvvthCL5LHHJSN1GS6BSMj+kYMnAphNDAoS+yCEwBUUUE40aNUqX7iYC05/6glatWjFQec4uJJEJIGwP5R2Skk2bNtHaDFeiMUQbSFQio5MCKHIRSFSCFHKfzmzJwOoDEADRAnxXU1pMUdHNN9/sSgS4AbQFwxoAPMe0EasP4tuZGZjrwUrAlMZ9aAQg9Ihmw+dKhIFoA8SQOx3BkoFtODJ9+nTcAtKLa330E088UW688UaIIFEXgAAoOcY1YBWDBHheSiLIgJQhAF47sSUZLgONUCGGRqEnTJgwQV566SU+d9KXtdvwi1/8IvuNVCwZ2NDhM888I1OmTNGtxwxOOOEECowggt3cAqwBRETCihAB5AAZ5AIQAuSUSAg7duygKhAroVG4DXfddZeucQC0XOvfv7+cf/75NvRoySArk0yR6EL+AOW2JBIZkPxyxx13uFoEkED79u31z4AzRzaRQNwQjltfQkiCpB1IgZ8bvIZwyy230IbNfEdkfZKPQPIXZFw3UrD7JlhQUwARUHtPP8J4HYBkIsiTHIB4IqAnAeEurAAGJ/kCHLkmWuN+cD1x4Dq4Hh5vFIRApuLw4cNpGst3xndnPgdNCHWCtQxs+HDy5MkyadIk+eijj8wkY8JhESSmF6Nm4xpQj7+LtUCNPv+TB0A41EJ4rpr0UMBlwILIAQjxmYP7xkUyiVSEPCFFCDM+gYo8CQ4+b3QO/pYNoZfEJAhQv+fRRx9tmsZkFHa0ZGCB8KZQp2nRhVgYj9/+9rdupceEsihNZhIYVZ+Bn5NU5GSkHb9LUqKFAFFQGszuStkAr0nIFKGUA4vJCJoQoJn8nBPFU57DAclCTpAG14fgyfVxcC91BQ1Zn3rqKTFAVLzgggvIWETUTY8QLBlYsZCowd///neaeMab3ZiZmKCu4UO6FZFHEA+IAIshU9SHlCEChEMPkIeAT12fsCP3hOtBazYiJRAAh7GISLrigBAyDpVCDFgJJFJxxpKBIOoCCsQgPwAhkQvy61//miiDFRUtGaQWDMkhYEUhwxDzNc4nx/RkEEkiEKogCsg0kSTiIwh5IFveI+lEZ4IiiiKGZgjMfcRRUq5xBQwJxP+dx7nnekVGjKvDGVcC98HsG5kJSL4aOXKkCb2S/k2GItYduQhWULRk4N2yHAIgjwAySAA19MSuE0U7zGP2AXCNFmApuCDX5MDk4bWTWg/szcBkwfJJAwijkB5uAZPLjfiy2quBa0QEBFgLWDv8jqjLz+mCIjIqShNdPb5LiCGxRbuFJQNEQoVGQD4ByTpxwJ/FKkisOWClYZcgdjBy2+OQiZMvAuB10yYDSIzdkFDbsX6SgHvGEuA+va6f7dRy0bQFEoAAeE8OCAIdAauG1vJpkSnP57vDwvgeaAbkH6AhIC46YmHJIJ4ICCE+8sgjuvowAaS2uomGRA/YIYiJwArrNkm8TGZIIWdkwARKBhP2NDs4ewE9AGuAnAmejwmfCBM5yBGwAnB74u+Ta0ELgND43NMqe6a6NB5oHoMGDdI5CJYQLBlojYDBBAk8+uijDDBWo0Q/mXTjRKuA3xENsQqShdoSBcRci4lcPy5Puvslcs9uZjfaCO3KjVvgZWGwZVo+RN14sjViJZYNR8pQKf87ZswYrKBdRFCiP5deeimkgMDYiDUEm3QEGZDPzsrBBqKug57aA/SAxBWI1ZCVn9fwgImt52LSJ31PrikNcP3cB6p9YpiUXZSxDJLG/Y2ImGPgjmHtJBI5VgtEgCCa9DpNaBFNKJ40+c757iE+Qo5YTI0Ulgwwk9944w0GCUTgpryT4+5mikIGTIaUZIDewCBTSuU6x4C/kcyT7ntxD0y0+PvjnrB4SM5JOcEgOgg0t/B+H+4TLQNLiP0okgF3jka18aTLa0IQaAiESSH+xgfrJiBC6cQisgwxNd2Ar0wXncSJCBFAEmgGKQAZkG+QD1cBcx8yyLRrEJEFJhSTju3NCJOm44tz//nKrkQwhHhdXRVEQgqUeA7wuia+a1yjBEAoZCdiHWBtOGIhRY1FJ8A3pEMOLgKDwwPsFMykSJyQrJqsqOmsivipDE581Fy4COZ/uU7IoC4mONYAST6QH2nWaRMKkzNP8BIwTUUo+gauBJ+3FyGgEbiSAY8xFnCPcD3MGLGWQcMHqaqKDENCiclMYfY6YLIkksFRRx3FwGJVyiRvn5U3F0QAwTGZzeTA6mHvQlZ8BEI0AQY65IbvTHs2TGMTVeA55PPTaTgTK4bX5J7yQeBs754qK5KGtKZi0ZUQILkHH3zQqy8loUYyFIkcNQYisGRA3cETTzzB5hxktSUNq1188cVuk5ZuOqyg3kTiHbMnOpE16yA+9m7yC5577jlasmmT2QMQGXF2Bj2TgJWR8J2HPuINEo24pxzDZCGmqtrkeWxew3O9rAN6UnimN5Ndefnll/O9N/D6BUsG+MeKfnl0M8bHTHK/bOnF7j2uZHD22WejxPNYXfL60REYqHUmgPiVDlWcxxjgbEdGgQ5E9bvf/Y5egJi9/E2r5mPHjsVaMCFTQmoQgpk4qOoZC3uEHnMM6inSIl7u6b333iNvxIsMIAuyGL1StWlYg07ETtBoIo4lg4YJCo8URIB/iH+ZQn1mpXQlAzroMKnrQZ6syLwGpnpGFoKxBiABA+7lr3/9K6nUXBtdgz0tkPvvv5/NSIylwkpIrgAmv/a7MwX6CeSWI0B46RZVYR3wXLpWYyW4EsKHH35IFClZuBWyhxAobLJk0FCtAkxEKtlYaVKIX/jPpOG6kQGrbraahJjSXrdGqbynOfDtPUU0xFBafqHu4wKlwk033cTO0LwfVgRFO1hCuA8UA/F6OuT68ccfG41Eh91OOukkegriliROIK4/F6KhSa3OxFrh3nB93MiAx9kUN+n3QU3J0KFDIdYGaB1YMqAkWVGARNpxGiDMhE/sRgYIi7nsKQghZKIjQATcFy2/sGbSae4qV111lXkvUnJxiZhIpnTbrcmqKQGGNPi/RAsBayerRMAqn+GY5DpJJkJAdSUDXpOQcgrwmVDQxP06NrTYwKyCBQsWMEAyEftY/V3JAJGNFdovMAo6FZSrV69Oy0Ux4UTIgIQdLAIScLAIevToQfswXCUtsj700EPy7LPPypw5c/R9X3HFFbqKEcS5KrgLRg+pr2CI9VFXSwtLhe/OjQzSjZZAJrhNEKBqGNaBtQxQ1RVmIdEDBnqaYEXw9OWZDD4ChVQQF7X76abUsvkIZGBWdfZ+QFxjizIZPXr0bmY/4iRRCqyHgQMHEo3wsmrQK+pSk2HaodWHaCE6iIQGtp4iIj0r0oia4BqhqbBnJuTnWMsg4MBHRDSi/18GYLB4kQETzleNRc21oKKzYqcAJMAR3zfRZGESgXCt3DzttNMQXs0ek3Luuecm++xI/oE44vUQr01geL7pkZCNxrBkiPKanvkGptYkFRgzjB30FD7X4MKSARl5auHChWyTTiOPrJGB6fPnFzDpuF5MW0z8VMBlipsoJFbhDpiehBCoV+QAnxtiTef+E5+TKI7mag9G3seLDDLulMTYITx75JFHqpiL4VgyCCaIOXOYVS9bZMBK7CfNgAQZREHyCcgjYBVLGrNnH4V4MiC0yI7GAPGNldVtYhtrgrAmv/sUXFsyMuD6034dxg5jiHqNXr16WcsgoGAFhAxMgk/WyID0XjIUEbr8AAYqZAAQECEFJjS+u7l2JgCmu0sUhEYfPE52JroKhTuu7hYEaMKR/OxD4AIYMvCyCjIhMv4fMkBMtGQQQMD8CrN38eLFKO0QQV36CGI+e3USQpX2zYSg3gDS45rNyocFkAIm65DJzf1BBgiuaAimS5PZ3ZkjvoDLr5YBwiX37hVNgBAzzvhkDDGW2Hg3lrLMeziWDIIBU5ZLppm3UJRaZGNldSUDfEnCeAw0H4CNWyg+wr/NtNsxTUwgPaIIEAFFTpABh5cVwntBhH51EeiM5GUZ8L3WyWVkLDGmEChJvLJkEJxiJLLoGBT16ZaMK+BKBrwufjrWgR/AZO7Xr5++5nnz5qW7gtIhmDRkREFyCthPgElO5yBPIuA5rI4+tQwgAb5/LzKA5Oraeo0xRRMUSwZBchEox80CGTCgXMmAFRSzmZXVJyBbkmo70mdJHkq28Qhp1hTiUJRDOBJyQ2MwVgK6AUKiSWBiAvA34u78L8ToZzJAP8kVGWBBcShcBZt05H/RUPcquPvuu+tjypJJR/svNxGRiYeYRMjJl30diQwgnmLy87PRADp27IgQxoFWgCZAlSP9DGgMqrMugwxCrBA1ZdwmxJgA7rVe2Y033HADCWmEGi0Z+BxsgKLJYNasWfVNDEIow0d0tQ4wq9lYhQEXVJCCTFYheQMU5XC/AQaWGkVKNDlxswogSiye+kQqyPaEDKhbcKyb4F9gGir8RartsmDGEjXACvB0FXgvTOiAgnwD7gP1nUmCC8CECqpVgFvDyu8VSUAbqbc4ydiiepOxFntPx1oGPtUKMIspUaY6MRtAIEQoBG5NUVHVCesFFVgFND0hJMl9UsqMCxFEIIjSuOaDDz7wzC+AvOkTWU9gFVDijJvoxzCjtQwI95EYQwVelmC6Dbu6CkwgstMI6xFmZDXyGTyTrRDXyMMgfo71w/P4/MjDpykqFY0BAuY7+ghWgadwyKoOEWQDjDHGGpEYBFufwZIBpi6DGbM3iyBqwOTwDDEyANl4FcIoJKKRmthRLSqyTcKRdaKi2yRaw+CPiMR+DqnvYkeVOFItxdUrpX3NNhnWr0qKQiJOSElNZEeMJOaIrH8n9vRDJCpNYkepVKsmUiNNJSolEi4qluKSZqJCLUWKWorjhCCS2gPE/54HYL3h7lBezRjwsgrIL8hmJSzEiSBrycCHwB/MCRnwuok1+hCC+RurK6spq0ShoKo3SVXFBgnvmC9hp1qKQxvEiW6XaLQamsCJEkdViyM1sSMqRVIliX1IwiGRUv1YpVTXfCJKiiSqwlIixRKRIv17KBoWVd1CKmQ/iTgtpai4qYSLykSFm0gktI+EwiXihEJ5IwOiH+gE5FYQTjZE4EHqWScDKjmtZuBD4ZC9Eun9BxnkIKmHgedZq0AvAGLwPC+LcGl/FpVoZKeEataJRDbLzsqtEop+J03lSwlHN4qKVkpp0TYpDlXV8/3ijkQRTZVIdbRcolIuoXCxJoAaaSnbovtIRJpLuLSVOCX7S7i4Sa4jB7g4EAETE83IkwioISG8mk1QDDZq1CgdkvWPkGgtAxJn6KvPF56rUmi+cK8SXFwFzEXyEnKWO6AileJUrdJEUCZfS7FaK03VdnGiFVIS2iHhIiaDMdNFuFLOHbsP5WK5YmnVrocmFMcJS5PmHaS0SVtNLtWVm7+/H3oM4G5UScWWVVK98zup2PqVfPbOvfFSLQd2kcSjTLUQFSqTypr28m3NTind4zBRApycaAS4aG+//TaCoWfzU0Ok1CNkG5ALY46xRyKSP2AtA1pyqeeff55ttxkYuRKpWI08rQP8R8xGXIZsI1JTJapiiTRTH0u5rJKw2ipFoUoRFV+mK9L5uKGxY5jsBkUTEUKtnJUmAycU5yeoiCYJDSek/w5UtJrneZPkdytjxwrZuWOdLHj1aqlWe8g26SqbVXeRsoMkFyDxh9oTagXoVeERRjRAAM6JuIvreNZZZ+k08PPOO89aBj4Bq4RRknPZTci1e7EB3YFIdoEwiC5kE5FoVBzKh2W7lIU3S5FTKQd0GyhdThy5+3Ort6dcjDUxRNNyJZI+r7QpOklEFr06SJQqlcroPrLN6SSR8N76erMIBFomNXUTEAEawffE5qRqK58r15Qxx9izAqLPMukILUEGuc5lYFC6WQcIVGaDEnL+s0oI0aiSqNNWNtccKkVqhzQr+UpWf/I4FBVzA4ZLLRzJO5a9caM40a2ytfoAWV9zuOws2l9bFiGJZLtTMgk/tFwzYiBEkOr/cqlTMeYYe5YMfABcAoWaz2oBEeQYpl8fg9CNENAW6CtgegxkLcLAy9cIIb6Osj4akXBNVJqXrJb1S6ZISFXLgcdeWxBC2LByhmxZO1fgx001h8n2UFdxnHIJRaPZ+qwx8xEIIXvTwCUdIuD/8yFcM/ZYBFRML8J1cKxmUDiLQDFQ/vjHP2pVOa/wHnzkJbDxCMISFkJ9Nyc1zUNjR0SkZos0cZbIvqUfScuyNVIcqpY2Hc+RdkcMRjfIG6or1suS1y6VaM12kbJOMvfrAeQdZOk+o+QMYIZTN4ELlkACvgGRJDalYSt7yN+xlkFhQCIJWYCU6/op24/rYrVAcWZTE+rfcS+yEFoUiTpNZVuko6ypiEjYUdKqfK1sXjlNJxPt2/WyvBkHaxbeJyG1XUIlTWVdy7HSqXwn1YAkADFhk20Ew2PmHP+Y6c+IBcCBO+BXEjBg7DEG6aBcwFwTSwaEjFg5DBn4ihBwGfBxiYWToUgeOwo0ImTmJKB2aS2uVLlslQ6yI1QtUqmkdfk3svmL6WQfyd6HXJhzC2HLmjlSsfE9najU47JtbpufcN+IfExqCILrNuo+z+PzgTRJ64YEsPLIEeHvXh2VfUsGjEHup3CwbgKqsrr11ltl9uzZfmq2ASEkthinySiEQJegVJWBTHpXUqBAhu5LTDgmUZPyElnyxm2yc9M8adN0vRQX1UjL/XvLXgefnzs/uWqzfD1/lKhIhYTa9pdjz5wsqQAp0F9h/PjxkAPxecjAS+cJVFk4Fh/7csbGITqR1QwKuX8i/hpFIz6CmwnMoGFDT8qE6RtAR+KUJABpoD10794dAkCL0MQCjJWwccM3svz9cbJh+bPSdo8NUhIjhPJm7aVpmxOkqLRV7GhNVqDOH8gGNi6dKJXfLhZnj2Pk6HPmS13BZi1EBiA1wn9BRocOHdCtCrQvoyUDVhf19NNPyx133KEHlO/g7R9T/kySEr0Q6EzMBE9sS4ZrQTcdkp1SkgYhz+WvD5bI2sfFC6HiZhIuaRl3tIj/PS2yqNg0X7asmqqLlLr1/Uic0vonWNExijZrQS6fx1obMWIElhsdpBxLBvkFA0jR1ebBBx+Mb1oRJFKglgFxkUnP6kJ+AqYmAyqjVGWjQ3z60lGiti+QuiBUtKeEiptDEt+fm+/yO1GDb5dNFBXdKV0vUJJNXH/99WyTTjvyQJICDXCuvvpqdrJmRytLBnkG+/6p2CFTp06Nzz0PAilg/rOLEfoBB9t/E3UwW53XmWicmpiYNfNkUTuWSNZBirKKSGi/IdLxpIckB8DMJk9DC45BAqROp+mzzz6bw7HRhAL0LyD+jHAYJFDtduqpp8rkyZPdiKJe4pkq2ks69ZktK1/pLmrnaskuIuI0P0E6QAS504BM7J4CIK2TBAGMQcYiYzLPsGSgYiCGT7ceFOmgdONBC+jbt6/ceeedyUKTnOscuZDi/aRD7zny5ezjRKqzODhL2kj7XtNESe4xd+5cioBoyYa46HvCN52jCJVaATH/TKzodTh69OhAuAhkINLvAI0jzTyDdAnB28fe8bGsmdNTJJKNARqSfc+s4pxXd2rw4MF8ZkSLAuEq3HzzzTJ8+HCrGeR5xyQFEUyYMCEQbgHCIJEPU/WYN6iIrHtlT5FopdQH4fY3Setud0q+YTZr4fMjo9PvuOyyy4hu5TOiYN0E6tgnTZokPgeJRsTTiUEXpEciol/bPltk06tluqdBXeC06C0tIYICZXTyub355puIrDQy8XUYecqUKWw/x7VayyAPoOeg6tmzp0539StokUa2IfFzXAQsgoJCVcuW2aWZE0Hp/tLshI9FhVtKAWEsBFqMoSNgGfo6zMj2dkcffbRjySC37c1Unz59amsRrrvuOhk3bpz4CGQJsvcAvi6ioW9Sax1VJTvmlGfwD8XSpNd2URL2lWp/5ZVXyowZM0g68+tO0Gxlx7Z1hIsdSwbZByYiRFBrESAgXnPNNay8ftrei6QTNvOotQj8hJoVIyT65Zj07uXkHaKcUl+G8a666ioIgfZnfk1SIquULfKznIRkyYDGl+r000+npFVPsD//+c8yYMAAk9rrl4IViIAVgV12fFtso5ZfKdE1D0syhFr3FefQqb4O5WEV0vOSkJ5fcNddd8mNN94YH2FgYWA7tsARQkj8B7bBVmx2aYhg4sSJbAOmq96WLVvmm629ULxnzpxZ6xr4Fc7BD0mo7QXefy87SMJdHvd7qBb3kKw/X21icskll8h9993HOK0tsceafe2115S1DOoJPkTUeOrfEeWIILD78fdgVYB1C+4aUE+A2WosgiBAfXqmqM0zE5igRIqOeUeiZUcEJvOPLdKfeeYZX/QiNPkQWAN/+MMfTDUmCwQdvIk0OJYM6oDp06erWAtqPlBKf3ENKOdNzDegPXlBVyjaXVFkA1kFC0rUwhNFbX1XDMKdJ4hqc2nQNtCRa6+9llRmrEdExUJGuuI1Lhk0aBALmSEEQo9YM44lg/RB8ZHq37+/IQJcA6r6XJkYU7FQgAgII7HfHxZB4MB+CguOFbV9oXYdpNMkCRpM49QhQ4awgBS0PoD+DInkgMhtrgn3Aev2N7/5jWPJIDXI1FMXXnghDK8bgNx///1eJb10zaV0tCBiIf0ISIaBCPg9uIiIs/Q8UV0QDB0JKmiXdtFFF+mQLnUrBYBrU146O1GiTSjUEMIjjzwiF198sWPJIAmeeOIJhWkFEdBgktROLAMP0GMQn7EQnW1ouUYkwyehTQvGLlWO5557LolJhShgI5LkWWE7bNiwXSIfDz/8sFx++eWOJYPdgSugfv/73wsge++WW27RDUSTYdGiRTJy5Mi8J5SwpRYWC36gb2BhOixT8chCkfdqxxdeeCHp1v5jxozR+z8YPPDAAyRROZYM4vCnP/1Job4CogVXXHFFSiIAb731Fv+b1zx58h3oRcD1WfgzwsD3w8QzXZnzhaeeeirVpj8sItTWxOcmYDVACLZQ6Z577lEkahgioPILNyGN1tPEcfOaS0A0gwashBP9CQt8ctqP0Y152rRp2lfPE9IZs1gCVNuaKkySlOhhqWLlz05jtgzoR6DY4940xiSZKMNW6bBx3nQCIhwIltQfWPg73Dhr1ix57LHHSAnOV7iRfpxp963EpZgzZ44Y0Avh9ttvdxolGcRIQPckAGQY0gosU9AvD/bPNRAx6W83cOBAtkzzfxjRAhWfsC+rMAVuefnOMPkzAfkpHAZDhw6VsWPHOo2JDOgGozsVAdI1yeCrA2BWjpy7ByQ24b7gxkAM/ocFBW3s0PTiiy/K448/LqtXr865hWCs3Eyt2/goBNG0v/zlL05jIAPEQUWcFdAIggYgGYLtrMjwogllrvMJuD5CQCjUhBKtixCgrfdQ8FesWCGPPvooEy7XCUmIy3S4zjjvhL0aSZgyIF8iNkd4HadBkgF9C2G9J598ktg8qy0biGTy/+zKS8gob91uuE50AjbHQDNgR2UsBd/DguxV6hVIQCLqROiaJLWcuwuMDxaQbt26ZWJFEvlA3zD5EWQpMlc0ITQoMoAIYDv6AMKaqL3sG5AGSCQhrZP4LFlm+exWRLcaCk5oVkJOgd4BKTiwwDVQSkEIFDORCozrkC/Nh12ZyZlh0UvHWiDygfBpCpwQ1KlngGCcBkEGhE1YXRH6CMkhFNIaKgXYJQnzifqDghSf8AVCYAiHEANkQFp0cGCxbt06M7FYTLR18PLLL+dbAGbsYFmSVZty7OPasJGwWfhwT6l4hBACTQYQAZWHNKFgQh1//PH43Sm/wM8//7ygJalcK18CoiHWAO4CjSrYUy8wsMCdRDswFiaTjOpXTPKC7cXAGGL/jHbt2pET4ZWvgGvDtRuRncWUcekEkQz48BVmDsINxTyE5Lz8bVZ+zDe+JEy6QoNNTyGCU045RQxgdIgsMLBgLMXvw8kYo/6F3hP00Sx0Zywas7C9HuPKbSElMcnMB8aiWVSdQJEBRBBbWWlOgvqOoOJGBIglkAC97DDnfJPBRtUkoiHsbdC6deuA9SywwBrYuHHjLhEGQnnjx49nk1e/5ItABuyvgUDN+IvX2tDLzE5NbMRD4xSe7wSBDGAydcYZZ9AmHNMaP4kbTCw3xR3gi/JVQ0vqDbp06aIbbnbv3j2+IhHBM1iFSRZmsYm3QBmfaAeE8rAOIAQ/pVITgUB4ZCyaa0Y3MxaOabiLper4mQy4YIiABqawF/427BvvC5EMAmH4tqMtFgG7AcPS8cCcCxws3BqmMj6J43P2azYpZIC+wJg0Lg7ionFjcb8hDsePZEBCB63M8XOwCLjQeBLgRnAFfL0x6uGHH04jChJHdnFrsBDw74IHC1xQLIREYfG5556jdkGPTT9vEQBZMZ9YXFlEOWIgjwFCwL1w/EQGsBZEQH8BGI2L5wOmZBO/jZ+DsCciLdTocIu4k8jSAQ4r2vAi4zARVDVS/k7dAm5rAMC4jI+C4NJS24C25fiCDNgEtXfv3rJ06VIJMKg7oBUVdRK7dS9CBKWpSSBhaxQQ4NzGLZWDJCPx98AWn5G/gFDfvn17p5D9DAgFKkIeCBxBrn/HRaBXAZmGDApIMZGReSxosPD+7hDpWACI5xNZ8CnoA8q1svpjvaLDceYwj/nLMkDcgGk5c5AGah4jeYiCIj9rBZ07d9bFSGzo6gbERHIlAgcLNAGiBl46F7oBm9/ku6syDXWJCJisRFZ4dDYSkjiz0kMCDbJQCVJQJBXxoVNJxtmETNgZiTOZh4XYDYnkKDIlYWEXEFYMZpszC/QCr25HaAV0uKZmAQ0hK64CqzXjpWvXruSlIEZzJtcGEdCcXd6oEbU9g+ViR1p5CtQkoJpyRoCkWtEULJnfs6XUogfwxbH6e8AIiv9n705etFivMIBXZZznwcxkHtU4RkUQjahIOyxUULIT3LiKAXHrVrLwD8hKEA3u1GDEhYJCBgWNaRNNHIIGk5jERO9NvJkr9YMUXPL18NVbnf6qqs+Bpq9eanWOz/uc50zdszD6z1R+JcKh4sTvxqmgRjuTuWNjYwmoEgtRk0+zl7sTiT9NZxA0Fzl0AdGBw2Ro392V6NF4JF2daqLW8JK+A5WHJoCgR8VBWNOunQeDrkQ7GqY9eEbWnqNx2AGbKhBaD5RhKb4jIGsok6sDg8ZDSGJz9izAABCo+1fKf5PURYqASmr7nCpgAgy6Wy2abgSeQm/vgLmFRimnmBSbs2cBBmYaNDZxog4zzk7JJb0G1FwVhbnJCoIZMOo9huiBSUkVAI4OVTE5y3sHAgzk+kp9wECVwrhnCisQAKhdv1OEMAxyOubnYcAONCApR9Z9WEa0BSvAoFo0ItejAqe8FBRk+d0ACMxJMAh24EW33cpGJKPOAKROY5NYxCwCDEbQKJSXuVmhJASVE+vBqF2AQYBBxTY1AqUssBGD1eMSYDACk6Pp0koBAymGrkNiz1B6A4rZaYv7i3w4HTPQc4Dua4KrCwZisVeTra/xq2O6gXyvdschx2n/9N9hYRXV1+ePHUhDawqIYlF3YTCDEZgeAf3cEFl1oc7SCN+ggxV17HeaEIYV8OGwjNMPdjCsbiCesEwMIQ8wGIFpFOIApUHj00SfYcGA2GNtuyBhvU8ToguxTpVJXA2bKlSr/Ua5CSvAAAqXr3shz7O+ChgMmSYQezgxmEGIhxN1twKEWkd5xaDqVoDB6EyPAVQ2ZGRMepig4DzpBWbgz8O+LN0dVgrxsA4YYAVof7VVaNpUQeyJQQxhdBZgwGlGoTlwWDaBztVuZZYmEIl6aqEXDDYQeTTsQRgKPACHxaUjtAADvQKqCg5WDmGWSFCMOVyAJARUzy3AoNKjAIIlvtN2t+pcXL9+fe+uc+ddDfgjR44UR48eVVXg/KkcZ5GJe491aD8A6fByk1huYutWDbN8x31Dg0uTalGYIlZw4MCB7NChQ3KJYAYtuLRbcIo5A/vspgADIg/6V1tUohl0DCjD0n1XbcOe6miOx0TMtWlKMcCA8ksHMIp87dq1yW4zCAhgQPChFySJUJ20EBBTZl/0Gqg88bt4mUhbEHNYY4BBm+YUys3Gxfj4+FTUn0NpBpgB9lAHEOzK66ZaHMZ3/J3CDIDBpHEi1lSlli5dGmDQIiPymDXQSmqxJTSfyMG6FgmOddMEbKObzCCs8l3KzUMtxuKG7vC/D4tYE3MYRB5g0K41aMZP7TPUbzDR2mtAwMECIwVsuggGYem+UyqkB9hvYIHOQCyJNdWsdlmAAfTWjVgsXrzY6uvJwAArGAiM3jODYAap69JoTOJmAAzoCWINWAQYtLOEpAmJmDjRhRyOBRrAIDX37PtJ9kgRBvtSJmwzFmNiiRjdQgswMD4KsS9fvuzHfYUBMCAIEZMS6Wb3WpIjReDvJif6B8AAu3SKb/Pmzf5/HmDQznn0/L9jzYXT6jdu3KjKStiADrGqVJRKN+dO41EwA9+pIImbqrwoxpztF2OqDYAgmEGLL+4WVF75HDB4ldlfUG1BbvTK9N5CPKwqBsBgYA2a2Gr/rsMAA2JPXtZ9C5oBcedVRzE4Fhg00Qw6IyKGNfeZ76QE4qayqtN17dq1AQZduce/cOFCDsvOnTvnZmMSGAQzCGagz0DcVMxSTBENPToBBh0w+RzxcPXq1dnNmzcdb62EnyZg4DvB1Z2KQswkVODdiBn4qSZkxZSHphsWYKA+nJeTZjYgaUSyEo1jiX8EoCZUH8h0o6IQxleNfO1bgrO4wRLEkphSvp4L9trDhw9nPTACz2GOe/jwoTPuUoVsy5YtM7KAAsNovYXpHFRNaHyJie5gGnb37t2uLEsd8mAGHRteKkXEompRPnPmjL9DG5u+NiPQDcJG5StdiJigtWZiSVz5IMCgY4YZEH/u3r1LSBzQCxKpYzc6EUMvqHpMGvsbGChXL1myJOuoBRhA8VLwK5YtW6ZjbMYWlGh7NsveJQu9IJ1dPHnyxFozE4p5gEF3Db1TAdA1Zn0VzWBGAkTJqf8WYPD8+XOpglQzYwEGHa8sFKUZLLHccga20kgTUNAWb0uOBah8xGYADHQcSjkDDPpg8+fPzx48eGAlWvb48WNbb2eCHfS7qhCswG5NpcVsbGyMbpAHGPTA8tJWrFihRRk7MNk4IwHnCEt/LcBArKxbt65HQBBgwKQH+apVq4pLly7ZhGSJqn/MjffqqUO3yuKMWuMZEt+71OXRWLNmTcYCDHpmy5cvlyrYglS1JjetKrTvpHvMIjQuKWpQ87Nx40ZVozzAoH9m0CQvS0TF2bNnIX81uNSIjvq+PxYpgo5FsWH+YMGCBRkLMOipLVq0KLt9+3Z269Yt9WPDJ02YAUBpT6oQKQKfNAIDMWEWYdOmTVhfHmDQYyMGlafVCkqxo5r6Dqp/0InB1z4hMe4jJPlSHwrRcNeuXVU/SjCDnpvSYr5y5criwoULbvD5c3KZ8MWLF+1IFcL4AkCnphdiQdsxbWmuMIIAA1aCQXbnzp3s3r17tiEZS03NMYlWLWhPjlkEvkg1MQDUt23bloUNXGHuvdmFX5w4ccJv66yS116rKNiCMzoLo/4D5RSTLtqOtWfPHt2Gc5EVBBiwq1evFufPn9d2ih3I/7UZJ+3X991ILNqP+S+5bfnRo0eYIq0gAQgiTehV7wGKeOXKFe2njmN46aM9uVvHc5KvZPG55qKdO3dmCRbMoIfBVBw7dszeA3mj4PA75eDGCMqMUU5UAUgBAukhP+/fv1+Har8cF8wg/U7jjh07iuPHj1uTJocUHCnsoCNHVmIVOh8THffu3RtAEMxg0O7fv1+cPHlSoBATndWq+9ITEmePHQQrIBzW/ubZs2d8TCPIynkVWk84LMBg0K5fv16cPn1awKgwOOFed7vS7LGD0ApqlxPNpTx9+jQrG8+y7du3BwhEmjCp2XOXl8yguHjxIoagf8CtvTqDMr5JYAdhCTcsam9L5lP7LbZu3Tr9BwEGYRs2bCBKmXDUlYZGWnNW58VqGTuICoLuRL5UPt63b1+WB1pHmlCnwnDq1KlsfHycSJXNmzevTmORfoX/37GV6DasxQroCgaQ7LA4ePAgoK4NBAEG0euuQ9ERFgGo5DhsL4GXJ5EdhP2HvXONseuq7vhv7X3OvXfmjufl8XgeHj/iCTGJncSKQ8MjEUWCqEitiFQKRbSVCIiKovQlJPhSVaKf+pAopZUiokptozYVlQsSDwFfEAECbULsBCd+j+15e96eO3Mf5+y9er3l2yvMTPyIHc/j/qSlvff1OSP5nHX+Z539WiISjHobVQ3mva8tU64dUytxzoXfgdr08HBsdQgx9P089dRTl0vhZmmIQUMQnnvuuRAhpGkahhyvVxAia7BWEBOzGg3qD3tdBDS0VSFNKohIEAFrDYWZYyRswVw5VtFQB1AFJQgHswuOoaGh8HlXKBR44oknwghRPp8PIl0V9fBvra2tQSjecLlyQwwaXM7XWO15DvPWDx8+HBK4Vh0ofK8ODAzQlvcYG1ctc8WhQcRcqYcGmTiLMXUHB0KJyWCMJQChLiK/9GDUj9dgG+3NXxcAQj2plDEC+CKqCaXiMs4l4TjvHEIZcQtIMlK1CwgKaCiN8RhScmYeRUL9lzFgMiBZMLlg2GYwzYjJY3Nb6ezaydbuAbq6d7O9fx+d2/dhrZWGGGyutN06NfYaM5OnmZo8y+zUCHMzI5DMon4J3BLBQavmkiWMlhEci6635ty1MtjVYW0QCGMBgzExXraQmD68acVkusPx2VwzSAQ2A2pAYqwRFAlCoao1W/ehf00IvHf4tERxcRKfLiJ+EaOLRFWzegn8LIoPx6p3GBIiWSY2FVTBGsV5gtiKGJBQBvNpiRtGIog6kLgTok5stofenfvp27GP7r599O0+uNE6Hhti4JzT8fNHmBw9zsiF15gefx2tTEI6i6YzkMwBKdfCGsEriBCwAk5BVQGBEN5qrY1TQTAoWZzk8WSoY/E2T0IPzmxFMjsQE5HL94AYoP4GBaHG2hSH1QXS+xKuskC5OItWLmF1HpueJdIFEMVohZxdQHCAAuA8WAOJg9iGNgKIgIiAALfLb00OiXsg00tT2yA7B9/J3rc9RM+ugxgTS0MM1iFpWtaxoZc4f/YoF06/QLJ0BsrjaDIOvsTNIGKoA4KiSCid1h+AmqEEWxlBsaS04CUHGiE2JqWTivSRmm5sdjs214EiK31SBFtLUYAQQDXBJwWS0jTGLZB1x4j8LHiPoYylgFACwBiwUe1cBYSmLf20bh0k3zZArqUbY7OEer5aN1GoN23pZSVKSxdxaTmIz9LCMGllqVYPVpgbYnH2DNdN3I1k95Brv5e9932AvfccorN7UBpisA64OHZcz50+wtDx71NZeA0tDUEyyfVgoybauu+leUs/+bYdiFiaWnpovlLP5bfR3NofnPNqVB2lwgTepxQXJ1heHAVgaX6k2h6rtkdYmHqdtFKgBkE8oC4ggiOHI0QRqGmjYvooMxjCWRNvQWtRg8gdjRSujgJAUZegaQEtvkoTw1idwVAkohBEAFUAROpv+pb2nXT0HqSr7yG2bL272t5Ftnkbt5NKcY6lhfNcmj7J7MQRZkZfpDA/xDXJDmCa72X7nvey7/4PsGPPg4gYaYjBGsJ7pyNDRzj+yveYHf4hfvkYlId5I+JsG519h2jdeg/t2++naUsfzVUTY7mdLC+OBXGYn3yVxdkTzI69RKU0hyqor0cViKCSIaUZp3m86QgRQ8lvw2XvDoIkIoDUzrkjQuCcQ10FaxRfGqbV/4yMXCSSRSylmgDURcAYtvYepHvP++je+Wh4y68Bwn2ZHv4JE2e+z9zEEbyvsBpBmFseonPgfRx852/T1TN4p/sWGmKgVSZHT3D0Z4e5NP4DtPAipHOsRkvHIF1VB9za92u0bruPtcLizHFmx/6nav/L3OSrK3QeCkoWR56KdFFkgKI9gDddiLFv+UiEiGCMwXtftRSpjNLmnicnF4nNIlbKgAL1CKB9+wH6Bj8Yrn9ViFnLuLTI9IXnGT/9beYmXgY8KxK1I63vZuDtH+bgIx8i29QmDTG4AxSX5vTIz77B+MnD6KXnIZ1nJfLtd9G95/109r2DXEsfa51KcZrZ0Z8yNfwjLk2/jqpCMB/qqjGpbKHMdublUVLnSOwAiEXE3FZBqPcNKKC40kWy6et0RKfJ2/G6CNQQ6Ox/B7v2f5yWzrtZjyzNn2X42H8wM/IjVkOaBsl2f5AHH/0j+ne+TRpi8BYyfO64Hvvp01QufgstnmIlWjr30bfvw7Ruu5/1iAhcmj7G2InDLE7/ghrGxDjncD4ipZ2S9jCb3EWZnSSmozbv4baJASj4lLh8hM7oJDk7SdYUsFIBQAQQyOW3M/jwn5Lv2Isq657iwjnOvPRlSovDrIhtQjp/i4EDn+KBh379di+TboiBVjn+6o85+/I/ojPfAF/kaqJMKwMHnqS16wAbhcLscS688lWS8hwiFjB451FVnMYUGaDAfuaTXVTYihhTiw5u+WiBdxXi8st0x6/QmpkgkjIYEKkf19H/Lnbc93sYidlIqHrGT36NqXPfZWUM0vE4fQee4sGHH0eqNMTgNgnBKy99n4lffBmd+w7guZot2x6k957fDaMCGw3vEyZP/Rfz4y8gYlAivNeqORRLiX5mKvcz5+/D0VwTg1s6ecglyzTra3RnLgvBKJFUqI//gzFCe+8j4R5sZC4OfZOZ899jRSRCOn+THQe/wH0HHm6Iwe3g1ImjeuHFL6Kz3wBNuZp853563vZREMNGZvrcN1kY/wkiBi8xQRCcw6ll2e9gNj3AXGWQVNpuiSDUOgoFpcm9Sm+uKgTZ4RARWAOmPrRItmUHO/Z/GsSw0Rk99lVKl4ZYEYmRnie59z1/QW9vrzTE4BYyMTGhJ37yRXTiGdAKV5Np7qNn3++DGDYDkyeepVy4gJgIVcGr4lyK1yxF3cVUcojJ4h5SH6Gqb3oOQVIpE/lhdrcepafpdYwkAJhaRCACKN2DHyXXdhebgXJhmMkT/8aq5HaTu+svefixj6+b9Q7ROtgjX88f/y5m4dsgFRCuhraeh1G3zGahvecdTJ+9gOKIrMErWDE4V8aaUUymnYW0l0I5X1sBeFO5CGtRASIYTcibWWLjqCECkRVAAcg0daBpgc1AJtdBFMWoT1iRZJh07gdMTT0eVr6+eRpiEPav04UfEqXDYFe7Ma2oK7BZiHOtRFEEmiLiMSqogBVBKWKjcfrbL3D64iCpj296dEFVCeZKZO0yTdESsfWYeochoNTAL6Nq2SxYoyCsgoPiy2EFbEMMbg1ho1JT/DkqDoQVCVGBt2wmjAEURECJUTWIUTQtYWWeVjOC83tw7uaGGkWkFplhKDHQeoq2pkUiK4gRVlp4kSwNE+W62Ayk5RmMpCCsTjJU29pdpUpDDG5B2m2bnH1D2fLlUWymg82Cq8wT2ZQAiuJRdagqKgKyTMQc3v/SzMSb/kzIMkUuXsZGHmsVYwCUq6lceoUo8zCbgcrCUaKIa1AM1zBJkpC1603SEAMRwVIEw6okiyew7fvZLCSLx7GGGogoisF7xeFAPNY4jHgc9qZHFbz34bzEZyi6PFFkiO3qSzE1maZy6RiZ/C42MsnyWPi/WsMbE3cSRdGtSuHfGE04efKkVo48ds2Vhza7jbh5BxudtHSRtDi6omh6BecVFct8ci8/PPc45SSuRQZvKl/BAzsvcKj7MNdDlOshaurdwNd/DFCuhbS+h5b7n2XXrl2N0YRbQT6fR7fcgy5M8oakU/higs12AcJGxFVmoDJLZKmBV+qTftRiRUlpIdEO0ATnDMaYNyMG4fyXz3bwSH8GfIVrkkzg/EIQBSRiQ6COtDQOrkhkuTaSwXQ8FrJ13xoaYhASmpQ7HsMv/RT0Go7o59FSAZPpQCRio6Ca4ivzGE0wllVQxBi8xnif5VLaBxqSvIS08977NyUGSsyL4+/nkb5vcX0U0dI5xDZhohYQu25FwKdLqFvGomC5LiS/n7jnQyE5b2PS0S2cZzB27uekpz6NFn7OdSMxYjLreyKSetRXQBOuF426mCgM8srEA5wYjiiVHdbaa6aPV9XQ0ZWmaSirhnOuZuH3nf2t/OFjXydmjhsm3I94/YiCOtQnoCmg3BCZ7dhdf0XHno9cfplJQwxuIYVCQS+d/xru/BegMsmNIfVy3aD18gZJ6GQq+xm+9K+nsdYGi+M4WBRFtd8Aag/6igLgva/tW0Aulwt5CPr7+/md9xbwY38PyQw3j9TKjXLd68RbMX1/TPPuz9LR0dFYm3A7qKY/0+Vz/4Af/RKk06xAg6iL3O4/p/Ptn5enn35ai8UiS0tLIfnoNQgPezV6CA9+rd7V1RXq3d3dl5PSSv0+fAU/9hVIxqnTgLgX0/dZcjs/E/oKGqsWbxshkaaWL/wTfuzLkIxRpwFxH5mdf0L7PZ+TVUYEgjhcRRj/zufzcqP5JUojz+JG/wbK50FTNjUSQXYXtv9zZPo+VkvT39jP4HZTdWitjD2LG/lrKJ+DhiNCdjeZnZ8nv/sTb5kTJkmixekf40b+Dp1/HvwCmxLThrQ/iun/M5q63v3WZWpqiEHdEcuzL+BH/jasW8BtUke0bUjbY2T3fJ5s57vkTuwxUS4VSMaewU/8M5TOgC+yKTBNkNuL6fkEUe+TZHMtd2p3o0beBK2SVJZx48/gJ5+B4iZzxKa92J5PkdnxaYzNyp0e8UmLE7iqIPjp/4TiafBlQNlYCJgsNA1iuj6CvSwETT1rRQQaeRO0iitN4if/GT/1HBRPbXBHvBuz7aNEvZ/EZLtlrQm0T5eCQOvM19HFF4NAg2d9Y4IAy5ZDyNYPYXqexMZrul+gkURF3bL6icuO+N9XOaKyPpGrHPEJTM8nEdssrAO0cFT9xX/Bz/8AiifAl9fJ/RDAXBHfezDt78V0/wHS8kAjvdoaoeGI6xgtnlE/9e+hj0eXjkE6DeoADXZnkWCIhagLyd8X+mLMto8hTXsbiVfXCA1H3KD4xRdV574TIjgtnoDKBLgC4HhrsGBbINODVEU3RF4dv4HZcqiRkn2N0HDETYqqV0pD6KUX0OXX0NIZqISlwpAugF8GXwZNAR9sZUwwJAKTBdMMURsSd0GmD8ntRZrvRVrfCbk9aydXYkMMGo74f+3UQQEAAAQEsKN/Z2Lw2EIsnyADgM4hQAaADAAZADIAZADIAJABIANABoAMABkAMgBkAMgAkAEgA0AGgAwAGQAyAGQAyACQASADgAVo9NbhukhrYgAAAABJRU5ErkJggg==";
});
//# sourceMappingURL=BasicTests.js.map
