from zope.interface import implements

from plone.portlets.interfaces import IPortletDataProvider
from plone.app.portlets.portlets import base
from plone.app.form.widgets.wysiwygwidget import WYSIWYGWidget

from Acquisition import aq_inner
from Products.CMFCore.utils import getToolByName

from zope import schema
from zope.formlib import form

from Products.Five.browser.pagetemplatefile import ViewPageTemplateFile

from pareto.portlet.jqTwitter import jqTwitterPortletMessageFactory as _


class IjqTwitterPortlet(IPortletDataProvider):
    """ A portlet """
    header = schema.TextLine(
        title=_(u"Portlet header"),
        description=_(u"Title of the rendered portlet"),
        required=True)

    term = schema.TextLine(
        title=_(u"Search term"),
        description=_(u"Either user or hashtag."),
        required=True)

    type = schema.Choice(
        title=_(u"Search term type"),
        description=_(u"Select the type of search."),
        values=("user", "hash"),
        required=True,
        default="user")

    info = schema.Text(
        title=_(u"Information"),
        description=_(u"Short text for portlet of the hash search type."),
        required=False)

    number = schema.TextLine(
        title=_(u"Number of results"),
        required=True)
    
    show_avatar = schema.Bool(
        title=_(u"Show avatar"),
        description=_(u"If enabled, avatar of users is shown."),
        default=False,
        required=False)

    show_info = schema.Bool(
        title=_(u"Show information"),
        description=_(u"If enabled, user or portlet information is shown."),
        default=False,
        required=False)

    show_user = schema.Bool(
        title=_(u"Show user information"),
        description=_(u"If enabled, instead of the portlet header and "
                      u"information, user information is shown."),
        default=False,
        required=False)


class Assignment(base.Assignment):
    """ Portlet assignment """
    implements(IjqTwitterPortlet)

    header = u""
    info = u""
    term = u""
    type = u""
    number = u""
    show_avatar = False
    show_info = False
    show_user = False
    def __init__(self, header=u"", info=u"", term=u"", type=u"", number=u"", 
                 show_avatar = False, show_info = False, show_user = False):
        self.header = header
        self.info = info
        self.term = term
        self.type = type
        self.number = number
        self.show_avatar = show_avatar
        self.show_info = show_info
        self.show_user = show_user
    
    @property
    def title(self):
        """This property is used to give the title of the portlet in the
        "manage portlets" screen.
        """
        return "Twitter Portlet: %s" % self.header


class Renderer(base.Renderer):
    """ Portlet renderer """

    render = ViewPageTemplateFile('jqtwitterportlet.pt')

    def transformed(self, mt='text/x-html-safe'):
        """Use the safe_html transform to protect text output. This also
        ensures that resolve UID links are transformed into real links.
        """
        orig = self.data.text
        context = aq_inner(self.context)
        if not isinstance(orig, unicode):
            # Apply a potentially lossy transformation, and hope we stored
            # utf-8 text. There were bugs in earlier versions of this portlet
            # which stored text directly as sent by the browser, which could
            # be any encoding in the world.
            orig = unicode(orig, 'utf-8', 'ignore')
            logger.warn("Static portlet at %s has stored non-unicode text. "
                        "Assuming utf-8 encoding." % context.absolute_url())

        # Portal transforms needs encoded strings
        orig = orig.encode('utf-8')

        transformer = getToolByName(context, 'portal_transforms')
        data = transformer.convertTo(mt, orig,
                                     context=context, mimetype='text/html')
        result = data.getData()
        if result:
            return unicode(result, 'utf-8')
        return None


class AddForm(base.AddForm):
    """ Portlet add form """
    form_fields = form.Fields(IjqTwitterPortlet)

    form_fields['info'].custom_widget = WYSIWYGWidget

    def create(self, data):
        return Assignment(**data)


class EditForm(base.EditForm):
    """ Portlet edit form """
    form_fields = form.Fields(IjqTwitterPortlet)

    form_fields['info'].custom_widget = WYSIWYGWidget
