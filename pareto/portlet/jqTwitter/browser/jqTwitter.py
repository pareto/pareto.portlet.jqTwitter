from zope.publisher.browser import BrowserView

from plone.portlets.interfaces import IPortletManager
from plone.portlets.interfaces import IPortletAssignmentMapping

from zope.component import getUtility, getMultiAdapter
from zope.component.interfaces import ComponentLookupError


class JQTwitterView(BrowserView):
    
    def isAssigned(self):
        ''' Check for the route portlet in the portlet managers. '''
        
        assigned = False
        portlet_managers = ['plone.leftcolumn', 'plone.rightcolumn']
        try:
            for pm in portlet_managers:
                manager = getUtility(IPortletManager, pm)
                assignment_mapping = getMultiAdapter((self.context, manager), 
                                                 IPortletAssignmentMapping)
                if 'jqTwitter' in assignment_mapping:
                    assigned = True
        except ComponentLookupError:
            pass

        return assigned
