import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, WebView } from 'react-native';
import { connect } from 'react-redux';
import I18n from 'react-native-i18n';
import Icon from 'react-native-vector-icons/Ionicons';
import NavBar from 'react-native-navbar';
import CommonWidgets from '@components/CommonWidgets';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Styles, Images, Colors, Fonts, Metrics, Icons, Texts } from '@theme/';
import { popRoute } from '@actions/route';
import { setSpinnerVisible } from '@actions/globals';
import Constants from '@src/constants';
import styles from './styles';

class Terms extends Component {

    render() {
        let terms = '<p><strong><u>Allgemeine Gesch&auml;ftsbedingungen der Firma Stylenow</u></strong></p>\n' +
            '<p>Onlineshop und Terminvereinbarung</p>\n' +
            '<ol>\n' +
            '<li><strong> Pr&auml;ambel</strong><br /> Stylenow stellt &uuml;ber ihr Internetportal unter <a href="http://www.stylenow.style">www.stylenow.style</a> sowie &uuml;ber die App stylenow Friseurdienstleistungen sowie Dienstleistungen von Manik&uuml;ren, Make-up Artists, Yogalehrern und Personal Trainern zum Kauf, die von jedermann entgeltlich angefordert werden k&ouml;nnen. Die folgenden allgemeinen Gesch&auml;ftsbedingungen regeln das Rechtsverh&auml;ltnis zwischen dem Kunden und Stylenow. Alle Leistungen, die vom Onlineshop und der Terminvereinbarung f&uuml;r den Kunden erbracht werden, erfolgen ausschlie&szlig;lich auf der Grundlage der nachfolgenden Allgemeinen Gesch&auml;ftsbedingungen. Abweichende Regelungen haben nur dann Geltung, wenn sie zwischen dem Unternehmen und Kunde schriftlich vereinbart wurden.</li>\n' +
            '<li><strong> Vertragsschluss </strong></li>\n' +
            '</ol>\n' +
            '<p><strong>2.1 bis 2.3 Vertragsabschluss im Onlineshop</strong><br /> 2.1 Die Angebote des Onlineshops sowie der Terminvereinbarung im Internet stellen eine unverbindliche Aufforderung an den Kunden dar, im Onlineshop Waren oder die Dienstleistungen bzw. einen Friseur/in, Manik&uuml;re, Make up Artist, Yogalehrer oder Personal Trainer zu bestellen.</p>\n' +
            '<p><br /> 2.2 Durch die Bestellung der gew&uuml;nschten Waren oder Dienstleistung im Internet oder per APP gibt der Kunde ein verbindliches Angebot auf Abschluss eines Kaufvertrages ab.</p>\n' +
            '<p><br /> 2.3 Das Unternehmen ist berechtigt, dieses Angebot innerhalb von 14 Kalendertagen unter Zusendung einer Auftragsbest&auml;tigung anzunehmen. Die Auftragsbest&auml;tigung erfolgt durch Zusendung einer Bestellbest&auml;tigung an die im Registrierungsprozess hinterlegte und best&auml;tigte E-Mail-Adresse des bestellenden Kunden. Nach fruchtlosem Ablauf der 14-Tages-Frist gilt das Angebot als abgelehnt.</p>\n' +
            '<p><strong>2.4 bis 2.7 Vertragsabschluss Dienstleistung</strong></p>\n' +
            '<p>2.4 Die Vertragsparteien vereinbaren die Zusammenarbeit gem&auml;&szlig; der spezifischen, individualvertraglichen Vereinbarung. Ein Arbeitsvertrag ist von allen Parteien nicht gewollt und wird nicht begr&uuml;ndet.</p>\n' +
            '<p>Stylenow dient als Vermittlungsplattform.</p>\n' +
            '<p>F&uuml;r die Abgaben der Sozialversicherung oder steuerliche Belange tr&auml;gt der Dienstleister selbst Sorge und stellt den Auftraggeber sowie stylenow von eventuellen Verpflichtungen frei.</p>\n' +
            '<p>2.5 Es steht dem Dienstleister frei, auch f&uuml;r andere Auftraggeber t&auml;tig zu werden.</p>\n' +
            '<p>2.6 Das Vertragsverh&auml;ltnis f&uuml;r die Dienstleistungen kommt durch Erteilung eines Kundenauftrags durch den Auftraggeber (Angebot) und dessen Annahme durch den Dienstleister zustande.</p>\n' +
            '<p>2.7 Der Vertrag beginnt und endet am individuell vereinbarten Zeitpunkt und Ort.</p>\n' +
            '<ol start="3">\n' +
            '<li><strong> Leistungsumfang, Pflichten der Vertragspartner</strong></li>\n' +
            '</ol>\n' +
            '<p>3.1 Die vom Dienstleister zu erbringenden Leistungen umfassen in der Regel die detailliert aufgelisteten Aufgaben, gem&auml;&szlig; dem vom Auftraggeber erteilten Auftrag.</p>\n' +
            '<p>3.2. Die Vertragspartner k&ouml;nnen im Vertrag einen Zeitplan f&uuml;r die Leistungserbringung und einen geplanten Endtermin f&uuml;r die Beendigung von Dienstleistungen vereinbaren.</p>\n' +
            '<p>3.3 Ist dem Dienstleister die vertraglich geschuldete Erbringung eines Auftrags tats&auml;chlich nicht m&ouml;glich, so hat er den Auftraggeber unverz&uuml;glich dar&uuml;ber in Kenntnis zu setzen.</p>\n' +
            '<p>3.4 Der Dienstleister stellt die zur Leistungserbringung erforderlichen Ger&auml;tschaften und das n&ouml;tige Personal, sofern der Auftraggeber nicht &uuml;ber entsprechendes Ger&auml;t oder R&auml;umlichkeiten verf&uuml;gt, es sein denn individualvertraglich ist etwas anderes vereinbart.</p>\n' +
            '<p>Die Parteien sind bem&uuml;ht, nach bestem Wissen und Gewissen den Vertragspartner bei der Erbringung der jeweiligen Verpflichtung durch &Uuml;berlassen von Informationen, Ausk&uuml;nften oder Erfahrungen zu unterst&uuml;tzen, um einen reibungslosen und effizienten Arbeitsablauf f&uuml;r beide Parteien zu gew&auml;hrleisten.</p>\n' +
            '<p>3.5 Jeder der Vertragspartner kann beim anderen Vertragspartner in nicht notwendig schriftlicher Form &Auml;nderungen des vereinbarten Leistungsumfangs beantragen. Nach Erhalt eines &Auml;nderungsantrags wird der Empf&auml;nger pr&uuml;fen, ob und zu welchen Bedingungen die &Auml;nderung durchf&uuml;hrbar ist und dem Antragsteller die Zustimmung bzw. Ablehnung unverz&uuml;glich schriftlich mitteilen und gegebenenfalls begr&uuml;nden. Erfordert ein &Auml;nderungsantrag des Auftraggebers eine umfangreiche &Uuml;berpr&uuml;fung, kann der &Uuml;berpr&uuml;fungsaufwand hierf&uuml;r vom Dienstleister bei vorheriger Ank&uuml;ndigung berechnet werden, sofern der Auftraggeber dennoch auf der &Uuml;berpr&uuml;fung des &Auml;nderungsantrages besteht.</p>\n' +
            '<ol start="4">\n' +
            '<li><strong> Lieferung</strong></li>\n' +
            '</ol>\n' +
            '<p><strong><br /> </strong>4.1 Alle Artikel werden umgehend, sofern ab Lager verf&uuml;gbar, ausgeliefert. Die Lieferung erfolgt nur innerhalb Deutschlands.&nbsp; Die Dienstleistungen werden zum vereinbarten Zeitpunkt an der vereinbarten Adresse ausgef&uuml;hrt.</p>\n' +
            '<p><br /> 4.2 Die Lieferzeit innerhalb Deutschlands betr&auml;gt, sofern nicht beim Angebot anders angegeben, maximal 14 Werktage.<br /> 4.3 Sollte ein Artikel kurzfristig nicht verf&uuml;gbar sein, informieren wir Sie per E-Mail &uuml;ber die zu erwartende Lieferzeit.<br /> Bei Lieferungsverz&ouml;gerungen, wie beispielsweise durch h&ouml;here Gewalt, Verkehrsst&ouml;rungen und Verf&uuml;gungen von hoher Hand, sowie sonstige von uns nicht zu vertretende Ereignisse, kann kein Schadensersatzanspruch gegen uns erhoben werden.<br /> Ihre gesetzlichen Anspr&uuml;che bleiben unber&uuml;hrt.</p>\n' +
            '<ol start="5">\n' +
            '<li><strong> Verpackungs- und Versand- und Anfahrtskosten<br /> </strong>5.1 F&uuml;r Lieferung innerhalb Deutschlands und Verpackungskosten berechnen wir einen anteiligen Pauschalbetrag von 5,90 EUR, unabh&auml;ngig von der Anzahl und dem Gewicht der Sendung.</li>\n' +
            '<li><strong> Zahlung</strong></li>\n' +
            '</ol>\n' +
            '<p>6.1 Alle angegebenen Preise sind Endpreise, die die gesetzliche Mehrwertsteuer von derzeit 19% beinhalten.<br /> 6.2 Bei Lieferung von Waren des Onlineshops innerhalb Deutschlands sind folgende Zahlweisen m&ouml;glich:<br /> <strong>Per Vorkasse,</strong> (Der Kunde ist verpflichtet, den Kaufpreis nach Vertragsschluss unverz&uuml;glich per &Uuml;berweisung, via paypal oder Kreditkarte auf unser Konto zu zahlen.) Bei Zahlung per Vorkasse erhalten Sie von uns eine E-Mail mit den genauen Rechnungsdaten. Bitte geben Sie bei Ihrer &Uuml;berweisung als Verwendungszweck Ihren Namen und die Rechnungsnummer an, damit wir Ihren Zahlungseingang der Bestellung zuordnen k&ouml;nnen.<br /> 6.3 Bis zur vollst&auml;ndigen Bezahlung bleiben die gelieferten Waren unser Eigentum (Eigentumsvorbehalt nach &sect;&sect;158, 449 BGB). Bei &Uuml;berschreiten der vereinbarten Zahlungsfristen m&uuml;ssen wir Mahn- und Bearbeitungsgeb&uuml;hren berechnen.<br /> 6.4 Bei der Bestellung &uuml;ber die Terminvereinbarung gibt es standortabh&auml;ngige, unterschiedliche Zahlungsm&ouml;glichkeiten.</p>\n' +
            '<p>6.5 Dienstleistungen werden zu dem individuellen Vertrag aufgef&uuml;hrten Festpreis nach Beendigung f&auml;llig und sofort bezahlt.</p>\n' +
            '<ol start="7">\n' +
            '<li><strong> Widerrufsbelehrung</strong></li>\n' +
            '</ol>\n' +
            '<p>Widerrufsrecht Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von Gr&uuml;nden diesen Vertrag zu widerrufen. Die Widerrufsfrist betr&auml;gt vierzehn Tage ab dem Tag:</p>\n' +
            '<p>7.1 (a) Widerrufsrecht (Bestellung von Dienstleistungen):</p>\n' +
            '<p>des Vertragsabschlusses.</p>\n' +
            '<p>7.1 (b) Widerrufsrecht (Bestellung von Waren im Onlineshop):</p>\n' +
            '<p>an dem Sie oder ein von Ihnen benannter Dritter, der nicht der Bef&ouml;rderer ist, die Waren in Besitz genommen haben bzw. hat.</p>\n' +
            '<p>Um Ihr Widerrufsrecht auszu&uuml;ben, m&uuml;ssen Sie uns Stylenow, Stephanie Eckert, K&uuml;mmelbergstra&szlig;e 33, 96328 K&uuml;ps, Telefon +49(0)-151-12445876, Fax +49(0)9264-968659, info@stylenow.style mittels einer eindeutigen Erkl&auml;rung (z.B. ein mit der Post versandter Brief, Telefax oder E-Mail) &uuml;ber Ihren Entschluss, diesen Vertrag zu widerrufen, informieren. Sie k&ouml;nnen daf&uuml;r das beigef&uuml;gte Muster-Widerrufsformular unter&nbsp;<a href="http://www.stylenow.style/muster-widerrufsformular.pdf">www.stylenow.style/muster-widerrufsformular.pdf</a>&nbsp;verwenden, das jedoch nicht vorgeschrieben ist. &bdquo;Sie k&ouml;nnen das Muster-Widerrufsformular oder eine andere eindeutige Erkl&auml;rung elektronisch ausf&uuml;llen und &uuml;bermitteln. Machen Sie von dieser M&ouml;glichkeit Gebrauch, so werden wir Ihnen unverz&uuml;glich (z. B. per E-Mail) eine Best&auml;tigung &uuml;ber den Eingang eines solchen Widerrufs &uuml;bermitteln.&ldquo;</p>\n' +
            '<p>Zur Wahrung der Widerrufsfrist reicht es aus, dass Sie die Mitteilung &uuml;ber die Aus&uuml;bung des Widerrufsrechts vor Ablauf der Widerrufsfrist absenden.</p>\n' +
            '<p>7.2 Folgen des Widerrufs</p>\n' +
            '<p>Wenn Sie diesen Vertrag widerrufen, haben wir Ihnen alle Zahlungen, die wir von Ihnen erhalten haben, einschlie&szlig;lich der Lieferkosten (mit Ausnahme der zus&auml;tzlichen Kosten, die sich daraus ergeben, dass Sie eine andere Art der Lieferung als die von uns angebotene, g&uuml;nstigste Standardlieferung gew&auml;hlt haben), unverz&uuml;glich und sp&auml;testens binnen vierzehn Tagen ab dem Tag zur&uuml;ckzuzahlen, an dem die Mitteilung &uuml;ber Ihren Widerruf dieses Vertrags bei uns eingegangen ist. F&uuml;r diese R&uuml;ckzahlung verwenden wir dasselbe Zahlungsmittel, das Sie bei der urspr&uuml;nglichen Transaktion eingesetzt haben, es sei denn, mit Ihnen wurde ausdr&uuml;cklich etwas anderes vereinbart; in keinem Fall werden Ihnen wegen dieser R&uuml;ckzahlung Entgelte berechnet.</p>\n' +
            '<p>7.2 (a) Folgen des Widerrufs (Bestellung von Waren im Onlineshop):</p>\n' +
            '<p>Wir k&ouml;nnen die R&uuml;ckzahlung verweigern, bis wir die Waren wieder zur&uuml;ckerhalten haben oder bis Sie den Nachweis erbracht haben,<br /> dass Sie die Waren zur&uuml;ckgesandt haben, je nachdem, welches der fr&uuml;here Zeitpunkt ist.</p>\n' +
            '<p>7.2 (b) Folgen des Widerrufs (Bestellung von Dienstleistungen):</p>\n' +
            '<p>Haben Sie verlangt, dass die Dienstleistungen w&auml;hrend der Widerrufsfrist beginnen soll, so haben Sie uns einen angemessenen Betrag zu zahlen, der dem Anteil der bis zu dem Zeitpunkt, zu dem Sie uns von der Aus&uuml;bung des Widerrufsrechts hinsichtlich dieses Vertrags unterrichten, bereits erbrachten Dienstleistungen im Vergleich zum Gesamtumfang der im Vertrag vorgesehenen Dienstleistungen entspricht.</p>\n' +
            '<p>7.3 Terminstornierung:<br /> Termine m&uuml;ssen 48 Stunden vor Terminbeginn storniert werden. Sollte dies nicht rechtzeitig erfolgen, stellen wir Ihnen die Dienstleistungen inklusive Anfahrtskosten in Rechnung.</p>\n' +
            '<p>Ende der Widerrufsbelehrung</p>\n' +
            '<p>7.4 Garantie auf gewerblich genutzte Produkte</p>\n' +
            '<p>Bei den Produkten im Bereich Friseurbedarf des Onlineshop handelt es sich um gewerbliche Produkte, diese unterliegen einer Garantie von 12 Monaten.</p>\n' +
            '<ol start="8">\n' +
            '<li><strong> Gew&auml;hrleistung</strong><br /> Sollten Transportsch&auml;den an der Ware festgestellt werden, hat der Empf&auml;nger unverz&uuml;glich Schadensmeldung gegen&uuml;ber dem Frachtf&uuml;hrer (Versanddienst) zu machen. Sonstige erkennbare Transportsch&auml;den sind sp&auml;testens innerhalb von 7 Tagen nach Erhalt der Ware uns gegen&uuml;ber schriftlich geltend zu machen.<br /> Wir haften nicht f&uuml;r M&auml;ngel, die infolge fehlerhafter Handhabung, normaler Abnutzung oder durch Fremdeinwirkung entstanden sind. Bei Reparaturen an der Ware in Eigenleistung oder durch Dritte, die ohne unser schriftliches Einverst&auml;ndnis erfolgten, erlischt der Gew&auml;hrleistungsanspruch an uns.</li>\n' +
            '<li><strong> Haftung<br /> </strong>9.1 Der Onlineshop haftet in F&auml;llen des Vorsatzes oder der groben Fahrl&auml;ssigkeit nach den gesetzlichen Bestimmungen. Die Haftung f&uuml;r Garantien erfolgt verschuldensunabh&auml;ngig. F&uuml;r leichte Fahrl&auml;ssigkeit haftet der Onlineshop ausschlie&szlig;lich nach den Vorschriften des Produkthaftungsgesetzes, wegen der Verletzung des Lebens, des K&ouml;rpers oder der Gesundheit oder wegen der Verletzung wesentlicher Vertragspflichten. Der Schadensersatzanspruch f&uuml;r die leicht fahrl&auml;ssige Verletzung wesentlicher Vertragspflichten ist jedoch auf den vertragstypischen, vorhersehbaren Schaden begrenzt, soweit nicht wegen der Verletzung des Lebens, des K&ouml;rpers oder der Gesundheit gehaftet wird. F&uuml;r das Verschulden von Erf&uuml;llungsgehilfen und Vertretern haftet der Onlineshop in demselben Umfang.</li>\n' +
            '</ol>\n' +
            '<p>9.2 Die Regelung des vorstehenden Absatzes (9.1) erstreckt sich auf Schadensersatz neben der Leistung, den Schadensersatz statt der Leistung und den Ersatzanspruch wegen vergeblicher Aufwendungen, gleich aus welchem Rechtsgrund, einschlie&szlig;lich der Haftung wegen M&auml;ngeln, Verzugs oder Unm&ouml;glichkeit<br /> </p>\n' +
            '<p>9.3 Der Dienstleister haftet in F&auml;llen des Vorsatzes oder der groben Fahrl&auml;ssigkeit nach den gesetzlichen Bestimmungen. Die Haftung f&uuml;r Garantien erfolgt verschuldensunabh&auml;ngig. F&uuml;r leichte Fahrl&auml;ssigkeit haftet der Dienstleister ausschlie&szlig;lich nach den Vorschriften des Produkthaftungsgesetzes, wegen der Verletzung des Lebens, des K&ouml;rpers oder der Gesundheit oder wegen der Verletzung wesentlicher Vertragspflichten. Der Schadensersatzanspruch f&uuml;r die leicht fahrl&auml;ssige Verletzung wesentlicher Vertragspflichten ist jedoch auf den vertragstypischen, vorhersehbaren Schaden begrenzt, soweit nicht wegen der Verletzung des Lebens, des K&ouml;rpers oder der Gesundheit gehaftet wird. F&uuml;r das Verschulden von Erf&uuml;llungsgehilfen und Vertretern haftet der Dienstleister in demselben Umfang.</p>\n' +
            '<p>9.3 Stylenow wird von jeglicher Haftung ausgeschlossen. Stylenow dient als Vermittlungsplattform und haftet nicht f&uuml;r Dienstleister und Kunden. Die Dienstleister arbeiten selbstst&auml;ndig und verantworten ihre T&auml;tigkeit selbst.</p>\n' +
            '<p>Stylenow schlie&szlig;t ausdr&uuml;cklich jede Art von Haftung aus.</p>\n' +
            '<ol start="10">\n' +
            '<li><strong> Gerichtsstand</strong></li>\n' +
            '</ol>\n' +
            '<p>F&uuml;r die Gesch&auml;ftsverbindung zwischen den Parteien gilt ausschlie&szlig;lich deutsches Recht. Hat der Auftraggeber keinen allgemeinen Gerichtsstand in Deutschland oder in einem anderen EU-Mitgliedstaat, ist ausschlie&szlig;lich Gerichtsstand f&uuml;r s&auml;mtliche Streitigkeiten aus diesem Vertrag unser Gesch&auml;ftssitz.</p>\n' +
            '<ol start="11">\n' +
            '<li><strong> Copyright</strong><br /> Alle dargestellten Fremdlogos, Bilder und Grafiken sind Eigentum der entsprechenden Firmen und unterliegen dem Copyright der entsprechenden Lizenzgeber. S&auml;mtliche auf diesen Seiten dargestellten Fotos, Logos, Texte, Berichte, Skripte und Programmierroutinen, welche Eigenentwicklungen von uns sind oder von uns aufbereitet wurden, d&uuml;rfen nicht ohne unser Einverst&auml;ndnis kopiert oder anderweitig genutzt werden. Alle Rechte vorbehalten.</li>\n' +
            '<li><strong> Sonstiges</strong><br /> Wir haben keinen Einfluss darauf, wenn Artikel von unseren Lieferanten aus dem Programm genommen werden und somit nicht mehr lieferbar sind oder in Art und Ausf&uuml;hrung ge&auml;ndert wurden. Sollte uns vom Lieferanten ein Ersatzartikel angeboten werden, so werden wir Sie dar&uuml;ber informieren. Ein Schadensersatzanspruch wegen nicht mehr lieferbarer Artikel kann nicht gegen uns geltend gemacht werden.<br /> Preis&auml;nderungen einzelner Artikel behalten wir uns vor.</li>\n' +
            '<li><strong> Links auf unseren Seiten</strong></li>\n' +
            '</ol>\n' +
            '<p>Mit Urteil vom 12. Mai 1998 &ndash; 312 O 85/98 &ndash; &bdquo;Haftung f&uuml;r Links&ldquo; hat das Landgericht Hamburg entschieden, dass man durch die Ausbringung eines Links die Inhalte der gelinkten Seite ggf. mitzuverantworten hat. Dies kann &ndash; so das LG &ndash; nur dadurch verhindert werden, dass man sich ausdr&uuml;cklich von diesen Inhalten distanziert.</p>\n' +
            '<p>Hiermit distanzieren wir uns deshalb ausdr&uuml;cklich von allen Inhalten s&auml;mtlicher gelinkten Seiten auf unserer Homepage sowie auf der APP. Diese Erkl&auml;rung gilt f&uuml;r alle auf unseren Internetseiten angebrachten Links.</p>\n' +
            '<ol start="14">\n' +
            '<li><strong> G&uuml;ltigkeit der AGB</strong></li>\n' +
            '</ol>\n' +
            '<p>Mit einer Bestellung werden die Allgemeinen Gesch&auml;ftsbedingungen des Onlineshops und der Dienstleistungsbestellung anerkannt. Sollte eine Bestimmung dieser Allgemeinen Gesch&auml;ftsbedingungen, aus welchem Grund auch immer, nichtig sein, bleibt die Geltung der &uuml;brigen Bestimmungen hiervon unber&uuml;hrt.</p>\n' +
            '<p>M&uuml;ndliche Absprachen bed&uuml;rfen der schriftlichen Best&auml;tigung.</p>\n' +
            '<ol start="14">\n' +
            '<li><strong> Google Maps</strong></li>\n' +
            '</ol>\n' +
            '<p>Mit der Nutzung unserer Webseite akzeptieren Sie die Datenschutzbedingungen von Google Maps, diese k&ouml;nnen Sie hier einsehen: Datenschutz:&nbsp;<a href="https://www.google.com/policies/privacy/?hl=de">https://www.google.com/policies/privacy/?hl=de</a>&nbsp;Nutzungsbedingungen:&nbsp;<a href="https://www.google.com/intl/en/policies/terms/?hl=de">https://www.google.com/intl/en/policies/terms/?hl=de&nbsp;</a></p>\n' +
            '<p>&nbsp;</p>';

        const leftButton = (
            <TouchableOpacity
                style={[Styles.center, Styles.navBarIcon]}
                onPress={() => this.props.popRoute()}>
                <Icon name='ios-arrow-back' size={25} color={Colors.white} />
            </TouchableOpacity>
        );

        return (
            <View style={Styles.fullScreen}>
                {CommonWidgets.renderStatusBar(Colors.black)}
                <NavBar
                    containerStyle={Styles.navBarStyle}
                    statusBar={{style: 'light-content', tintColor: Colors.black }}
                    leftButton={leftButton}
                />
                <View backgroundColor={Colors.white} style={styles.container}>
                    <WebView
                        source={{html: terms}}
                    />
                </View>
            </View>
        );
    }
}
Terms.propTypes = {
    dispatch: React.PropTypes.func.isRequired,
    popRoute: React.PropTypes.func.isRequired,
};
function mapDispatchToProps(dispatch) {
    return {
        dispatch,
        popRoute: () => dispatch(popRoute()),
    };
}
function mapStateToProps(state) {
    const globals = state.get('globals');
    return { globals };
}
export default connect(mapStateToProps, mapDispatchToProps)(Terms);
